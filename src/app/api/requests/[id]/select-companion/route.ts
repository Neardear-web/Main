import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSessionConfirmedSms } from '@/lib/sms'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Parse body
  let companionId: string
  try {
    const body = await req.json() as { companionId?: unknown }
    if (typeof body.companionId !== 'string' || !body.companionId) {
      return NextResponse.json({ error: 'companionId is required' }, { status: 400 })
    }
    companionId = body.companionId
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Load and verify request ownership
  const request = await prisma.request.findUnique({
    where: { id },
    include: { user: { select: { phone: true } } },
  })

  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  if (request.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Load companion and verify active status
  const companion = await prisma.providerProfile.findUnique({
    where: { id: companionId },
    include: { user: true },
  })

  if (!companion) {
    return NextResponse.json({ error: 'Companion not found' }, { status: 404 })
  }

  if (companion.accountStatus !== 'ACTIVE') {
    return NextResponse.json({ error: 'Companion is not currently active' }, { status: 400 })
  }

  // Determine scheduled date and time
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const scheduledDate = request.preferredDate ?? tomorrow
  const scheduledTime = request.preferredTimeSlot ?? 'Morning'

  // Create session
  const newSession = await prisma.session.create({
    data: {
      requestId: id,
      companionId,
      status: 'SCHEDULED',
      scheduledDate,
      scheduledTime,
      serviceCity: request.serviceCity,
      isRemote: false,
    },
  })

  // Update request status
  await prisma.request.update({
    where: { id },
    data: {
      status: 'ACCEPTED',
      acceptedAt: new Date(),
    },
  })

  // Update the accepted companion's notification
  await prisma.requestNotification.updateMany({
    where: {
      requestId: id,
      providerProfileId: companionId,
    },
    data: { status: 'ACCEPTED' },
  })

  // Expire all other notifications for this request
  await prisma.requestNotification.updateMany({
    where: {
      requestId: id,
      providerProfileId: { not: companionId },
    },
    data: { status: 'EXPIRED' },
  })

  // Notify family user
  await prisma.notification.create({
    data: {
      userId: request.userId,
      channel: 'IN_APP',
      title: 'Companion accepted',
      body: `${companion.legalName} has accepted your request`,
      data: { requestId: id, sessionId: newSession.id },
    },
  })

  // Notify companion
  await prisma.notification.create({
    data: {
      userId: companion.userId,
      channel: 'IN_APP',
      title: 'You have been selected',
      body: `You have been selected as a companion for a new request`,
      data: { requestId: id, sessionId: newSession.id },
    },
  })

  // SMS — fire-and-forget
  const dateLabel = scheduledDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  if (request.user?.phone) {
    sendSessionConfirmedSms(
      request.user.phone,
      companion.legalName,
      dateLabel,
      scheduledTime
    ).catch(console.error)
  }
  if (companion.user?.phone) {
    sendSessionConfirmedSms(
      companion.user.phone,
      companion.legalName,
      dateLabel,
      scheduledTime
    ).catch(console.error)
  }

  return NextResponse.json({ sessionId: newSession.id })
}
