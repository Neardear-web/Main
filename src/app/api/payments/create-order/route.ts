import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCompanionRate, calculateEarnings } from '@/lib/earnings'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { sessionId } = body as Record<string, unknown>
  if (typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  const dbSession = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      request: {
        include: {
          requestServices: { include: { serviceCategory: true } },
        },
      },
      companion: true,
    },
  })

  if (!dbSession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (dbSession.request.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Use the highest suggestedFeeMin among requested services
  const fee = dbSession.request.requestServices.reduce((max, rs) => {
    return Math.max(max, rs.serviceCategory.suggestedFeeMin ?? 600)
  }, 600)

  const { companionPct, platformPct, source: rateSource } = await getCompanionRate(
    dbSession.companionId,
    dbSession.serviceCity,
    dbSession.scheduledDate
  )
  const { companionShare, platformShare } = calculateEarnings(fee, companionPct)

  const amountPaise = fee * 100
  const companionSharePaise = companionShare * 100
  const platformFeePaise = platformShare * 100

  void platformPct // used implicitly via calculateEarnings

  const primaryService = dbSession.request.requestServices[0]?.serviceCategory

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: sessionId,
    notes: {
      sessionId,
      companionName: dbSession.companion.legalName,
      serviceName: primaryService?.name ?? 'Companion Service',
      platformFee: platformFeePaise,
      companionShare: companionSharePaise,
    },
  })

  // Upsert payment record (idempotent — allow retries)
  await prisma.payment.upsert({
    where: { sessionId },
    update: {
      razorpayOrderId: order.id,
      amount: fee,
      platformFee: platformShare,
      companionShare,
      status: 'PENDING',
    },
    create: {
      requestId: dbSession.requestId,
      sessionId,
      userId: session.user.id,
      razorpayOrderId: order.id,
      amount: fee,
      currency: 'INR',
      status: 'PENDING',
      platformFee: platformShare,
      companionShare,
    },
  })

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    companionName: dbSession.companion.legalName,
    serviceName: primaryService?.name ?? 'Companion Service',
    sessionId,
    fee,
    companionEarnings: companionShare,
    companionPct,
    rateSource,
  })
}
