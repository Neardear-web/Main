import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CancellationWindow, EarningStatus } from '@prisma/client'
import { sendCancellationSms } from '@/lib/sms'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

function computeWindow(scheduledDate: Date, scheduledTime: string | null): {
  window: CancellationWindow
  hoursBeforeSession: number
} {
  const now = new Date()
  const sessionDt = new Date(scheduledDate)

  if (scheduledTime) {
    const [h, m] = scheduledTime.split(':').map(Number)
    sessionDt.setHours(h ?? 0, m ?? 0, 0, 0)
  } else {
    sessionDt.setHours(0, 0, 0, 0)
  }

  const hoursBeforeSession = (sessionDt.getTime() - now.getTime()) / (1000 * 60 * 60)

  const isSameCalendarDay =
    scheduledDate.getFullYear() === now.getFullYear() &&
    scheduledDate.getMonth() === now.getMonth() &&
    scheduledDate.getDate() === now.getDate()

  let window: CancellationWindow
  if (hoursBeforeSession > 48) {
    window = CancellationWindow.HOURS_48_PLUS
  } else if (hoursBeforeSession > 24) {
    window = CancellationWindow.HOURS_24_TO_48
  } else if (hoursBeforeSession <= 0) {
    window = CancellationWindow.POST_SESSION
  } else if (isSameCalendarDay) {
    window = CancellationWindow.SAME_DAY
  } else {
    window = CancellationWindow.HOURS_UNDER_24
  }

  return { window, hoursBeforeSession }
}

function computeAmounts(
  totalAmount: number,
  window: CancellationWindow
): { refundAmount: number; companionComp: number; platformRetained: number } {
  const companionShare = Math.round(totalAmount * 0.8)
  const platformFee = totalAmount - companionShare

  switch (window) {
    case CancellationWindow.HOURS_48_PLUS:
    case CancellationWindow.HOURS_24_TO_48:
      // Full refund — companion gets nothing, platform retains nothing
      return { refundAmount: totalAmount, companionComp: 0, platformRetained: 0 }

    case CancellationWindow.HOURS_UNDER_24:
      // 50% refund to user, 50% compensation to companion
      return {
        refundAmount: Math.round(totalAmount * 0.5),
        companionComp: Math.round(totalAmount * 0.5),
        platformRetained: 0,
      }

    case CancellationWindow.SAME_DAY:
    case CancellationWindow.POST_SESSION:
      // No refund — original split stands
      return { refundAmount: 0, companionComp: companionShare, platformRetained: platformFee }

    default:
      return { refundAmount: totalAmount, companionComp: 0, platformRetained: 0 }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authSession = await auth()
  if (!authSession?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: sessionId } = await params

  let body: { cancelReason?: string; cancelReasonCategory?: string } = {}
  try {
    body = await req.json()
  } catch {
    // body is optional
  }

  const dbSession = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      request: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
      payment: true,
      earning: true,
    },
  })

  if (!dbSession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Only the booking user can cancel
  if (dbSession.request.userId !== authSession.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!['SCHEDULED', 'CONFIRMED'].includes(dbSession.status)) {
    return NextResponse.json({ error: `Cannot cancel a session with status ${dbSession.status}` }, { status: 400 })
  }

  const payment = dbSession.payment
  const earning = dbSession.earning

  // No payment yet — cancel freely
  if (!payment || payment.status === 'PENDING') {
    await prisma.$transaction([
      prisma.session.update({ where: { id: sessionId }, data: { status: 'CANCELLED' } }),
      prisma.request.update({ where: { id: dbSession.requestId }, data: { status: 'CANCELLED' } }),
      ...(payment
        ? [prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } })]
        : []),
    ])

    await prisma.cancellationRecord.create({
      data: {
        sessionId,
        paymentId: payment?.id ?? null,
        cancelledBy: 'RECEIVER',
        cancelReason: body.cancelReason ?? null,
        cancelReasonCategory: body.cancelReasonCategory ?? null,
        sessionScheduledAt: dbSession.scheduledDate,
        hoursBeforeSession: 9999,
        window: CancellationWindow.BEFORE_PAYMENT,
        originalAmount: payment?.amount ?? 0,
        refundAmount: 0,
        companionComp: 0,
        platformRetained: 0,
      },
    })

    return NextResponse.json({ success: true, refundAmount: 0, window: 'BEFORE_PAYMENT' })
  }

  // Payment was captured — calculate refund
  const { window, hoursBeforeSession } = computeWindow(dbSession.scheduledDate, dbSession.scheduledTime)
  const { refundAmount, companionComp, platformRetained } = computeAmounts(payment.amount, window)

  // Refuse POST_SESSION cancellations (admin can override separately)
  if (window === CancellationWindow.POST_SESSION) {
    return NextResponse.json({ error: 'Session has already started. Contact support to cancel.' }, { status: 400 })
  }

  // Initiate Razorpay refund if applicable
  let razorpayRefundId: string | null = null
  let isPartial = false

  if (refundAmount > 0 && payment.razorpayPaymentId) {
    try {
      const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: refundAmount * 100, // paise
        speed: 'normal',
        notes: {
          reason: body.cancelReason ?? 'Cancelled by user',
          sessionId,
        },
      })
      razorpayRefundId = (refund as { id: string }).id
      isPartial = refundAmount < payment.amount
    } catch (err) {
      console.error('[CANCEL] Razorpay refund failed:', err)
      return NextResponse.json({ error: 'Refund initiation failed. Please contact support.' }, { status: 502 })
    }
  }

  const newPaymentStatus = refundAmount === 0
    ? 'CAPTURED'  // money stays, no refund
    : isPartial
    ? 'PARTIALLY_REFUNDED'
    : 'REFUNDED'

  // Database updates (atomic)
  await prisma.$transaction(async (tx) => {
    await tx.session.update({ where: { id: sessionId }, data: { status: 'CANCELLED' } })
    await tx.request.update({ where: { id: dbSession.requestId }, data: { status: 'CANCELLED' } })

    if (isPartial) {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: newPaymentStatus,
          partialRefundAmount: refundAmount,
          partialRefundReason: body.cancelReason ?? 'Cancelled <24h before session',
          partialRazorpayRefundId: razorpayRefundId,
          partialRefundedAt: razorpayRefundId ? new Date() : null,
        },
      })
    } else if (refundAmount > 0) {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: newPaymentStatus,
          refundAmount,
          refundReason: body.cancelReason ?? 'Cancelled by user',
          razorpayRefundId,
          refundedAt: razorpayRefundId ? new Date() : null,
        },
      })
    }

    // Handle earning
    if (earning) {
      if (companionComp === 0) {
        // Cancel the earning — companion gets nothing
        await tx.earning.update({
          where: { id: earning.id },
          data: { status: EarningStatus.CANCELLED },
        })
      } else if (companionComp !== earning.amount) {
        // Update earning to compensation amount — companion gets partial
        await tx.earning.update({
          where: { id: earning.id },
          data: {
            amount: companionComp,
            status: EarningStatus.PENDING,
          },
        })
      }
      // If companionComp === earning.amount (same-day), leave earning as-is
    }

    // Create cancellation record
    await tx.cancellationRecord.create({
      data: {
        sessionId,
        paymentId: payment.id,
        cancelledBy: 'RECEIVER',
        cancelReason: body.cancelReason ?? null,
        cancelReasonCategory: body.cancelReasonCategory ?? null,
        sessionScheduledAt: dbSession.scheduledDate,
        hoursBeforeSession,
        window,
        originalAmount: payment.amount,
        refundAmount,
        companionComp,
        platformRetained,
        razorpayRefundId,
        refundStatus: razorpayRefundId ? 'PROCESSING' : refundAmount === 0 ? 'NA' : 'PENDING',
        compStatus: companionComp > 0 ? 'PENDING' : 'NA',
      },
    })

    // Financial audit log
    await tx.financialAuditLog.create({
      data: {
        entityType: 'PAYMENT',
        entityId: payment.id,
        action: 'STATUS_CHANGED',
        previousValue: { status: payment.status },
        newValue: {
          status: newPaymentStatus,
          window,
          refundAmount,
          companionComp,
          razorpayRefundId,
        },
        actorId: authSession.user.id,
        actorType: 'RECEIVER',
        note: `Session cancelled by user. Window: ${window}. Refund: ₹${refundAmount}`,
      },
    })
  })

  // SMS — fire-and-forget
  const userPhone = dbSession.request.user?.phone
  if (userPhone) {
    sendCancellationSms(userPhone, String(refundAmount)).catch(console.error)
  }

  return NextResponse.json({
    success: true,
    window,
    refundAmount,
    companionComp,
    message:
      refundAmount === 0
        ? 'Session cancelled. No refund applies.'
        : `Session cancelled. ₹${refundAmount} will be refunded within 5–7 business days.`,
  })
}
