import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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

  // Only host or guest can view meeting details
  if (meeting.hostUserId !== session.user.id && meeting.guestUserId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(meeting)
}
