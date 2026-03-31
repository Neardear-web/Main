import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const meeting = await prisma.virtualMeeting.findUnique({ where: { id } })
  if (!meeting) {
    return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
  }

  // Only host or guest can mark as complete
  if (meeting.hostUserId !== session.user.id && meeting.guestUserId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.virtualMeeting.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: 'SESSION_COMPLETED',
      entityType: 'VirtualMeeting',
      entityId: id,
      metadata: {
        meetingType: meeting.meetingType,
        sessionId: meeting.sessionId,
        requestId: meeting.requestId,
      },
    },
  })

  return NextResponse.json({ success: true, completedAt: updated.completedAt })
}
