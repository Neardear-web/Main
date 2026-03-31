import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createGoogleMeetLink } from '@/lib/google-meet'

const schema = z.object({
  meetingType: z.enum(['INTRO_CALL', 'POST_SESSION_DEBRIEF', 'ADVISORY_SESSION', 'NEEDS_ASSESSMENT']),
  requestId: z.string().optional(),
  sessionId: z.string().optional(),
  guestUserId: z.string(),
  scheduledAt: z.string(), // ISO string
  durationMinutes: z.number().int().min(10).max(120).default(30),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as unknown
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const hostUserId = session.user.id
  const scheduledAt = new Date(data.scheduledAt)

  // Build human-readable title
  const typeLabels: Record<string, string> = {
    INTRO_CALL: 'Intro Call — NearDear',
    POST_SESSION_DEBRIEF: 'Session Debrief — NearDear',
    ADVISORY_SESSION: 'Advisory Session — NearDear',
    NEEDS_ASSESSMENT: 'Needs Assessment — NearDear',
  }
  const title = typeLabels[data.meetingType] ?? 'NearDear Meeting'

  const descriptionMap: Record<string, string> = {
    INTRO_CALL: 'Pre-visit introduction between family and companion via NearDear.',
    POST_SESSION_DEBRIEF: 'Post-session debrief between family and companion via NearDear.',
    ADVISORY_SESSION: 'Professional advisory session via NearDear.',
    NEEDS_ASSESSMENT: 'Needs assessment call via NearDear.',
  }

  // Generate Google Meet link
  const meeting = await createGoogleMeetLink({
    title,
    description: descriptionMap[data.meetingType] ?? 'NearDear platform meeting.',
    scheduledAt,
    durationMinutes: data.durationMinutes,
  })

  // Create VirtualMeeting record
  const virtualMeeting = await prisma.virtualMeeting.create({
    data: {
      meetingType: data.meetingType,
      requestId: data.requestId ?? null,
      sessionId: data.sessionId ?? null,
      hostUserId,
      guestUserId: data.guestUserId,
      meetLink: meeting.meetLink,
      scheduledAt,
      durationMinutes: data.durationMinutes,
      status: 'SCHEDULED',
    },
  })

  // Notify both parties
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: hostUserId,
        channel: 'IN_APP',
        status: 'PENDING',
        title: title,
        body: `Your ${data.meetingType === 'INTRO_CALL' ? 'intro call' : 'meeting'} is scheduled for ${scheduledAt.toLocaleString('en-IN')}`,
        data: { meetLink: meeting.meetLink, virtualMeetingId: virtualMeeting.id },
      },
    }),
    prisma.notification.create({
      data: {
        userId: data.guestUserId,
        channel: 'IN_APP',
        status: 'PENDING',
        title: title,
        body: `You have a ${data.meetingType === 'INTRO_CALL' ? 'intro call' : 'meeting'} scheduled for ${scheduledAt.toLocaleString('en-IN')}`,
        data: { meetLink: meeting.meetLink, virtualMeetingId: virtualMeeting.id },
      },
    }),
  ])

  return NextResponse.json({
    virtualMeetingId: virtualMeeting.id,
    meetLink: meeting.meetLink,
    scheduledAt: virtualMeeting.scheduledAt,
  })
}
