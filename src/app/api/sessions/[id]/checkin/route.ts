import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendCheckinSms } from '@/lib/sms'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: sessionId } = await params

  let body: { lat?: number; lng?: number } = {}
  try {
    body = await req.json()
  } catch {
    // GPS coords are optional
  }

  const dbSession = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      companion: { select: { userId: true, legalName: true } },
      request: { include: { user: { select: { phone: true } } } },
    },
  })

  if (!dbSession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (dbSession.companion.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (dbSession.status !== 'SCHEDULED') {
    return NextResponse.json(
      { error: `Cannot check in — session status is ${dbSession.status}` },
      { status: 400 }
    )
  }

  const now = new Date()

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: 'CHECKED_IN',
      checkedInAt: now,
      checkedInLat: typeof body.lat === 'number' ? body.lat : null,
      checkedInLng: typeof body.lng === 'number' ? body.lng : null,
    },
  })

  // SMS to family — fire-and-forget
  const familyPhone = dbSession.request.user?.phone
  if (familyPhone) {
    const timeStr = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    sendCheckinSms(
      familyPhone,
      dbSession.companion.legalName,
      timeStr,
      sessionId,
      dbSession.serviceCity ?? undefined
    ).catch(console.error)
  }

  return NextResponse.json({ success: true, checkedInAt: now.toISOString() })
}
