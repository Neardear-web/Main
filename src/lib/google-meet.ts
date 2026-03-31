/**
 * Google Meet link generation via Google Calendar API.
 *
 * Setup (one-time):
 * 1. Go to console.cloud.google.com
 * 2. Create a project → Enable "Google Calendar API"
 * 3. Create a Service Account → Download JSON key
 * 4. Share a Google Calendar with the service account (give it "Make changes to events" access)
 * 5. Add the credentials to .env.local:
 *    GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
 *    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
 *    GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
 *
 * Until credentials are configured, a dev stub link is returned in development.
 */

import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!email || !key) return null

  return new google.auth.JWT({
    email,
    key,
    scopes: SCOPES,
  })
}

export interface MeetingDetails {
  meetLink: string
  calendarEventId: string | null
}

export async function createGoogleMeetLink(options: {
  title: string
  description: string
  scheduledAt: Date
  durationMinutes: number
  hostEmail?: string
  guestEmail?: string
}): Promise<MeetingDetails> {
  const auth = getAuth()

  // Dev stub — returns a placeholder until credentials are configured
  if (!auth || process.env.NODE_ENV === 'development') {
    console.log('[DEV] Google Meet stub — real link will be generated once credentials are set')
    return {
      meetLink: `https://meet.google.com/dev-stub-${Date.now().toString(36)}`,
      calendarEventId: null,
    }
  }

  const calendar = google.calendar({ version: 'v3', auth })
  const calendarId = process.env.GOOGLE_CALENDAR_ID ?? 'primary'

  const endTime = new Date(options.scheduledAt.getTime() + options.durationMinutes * 60 * 1000)

  const attendees = []
  if (options.hostEmail) attendees.push({ email: options.hostEmail })
  if (options.guestEmail) attendees.push({ email: options.guestEmail })

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: options.title,
      description: options.description,
      start: { dateTime: options.scheduledAt.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `neardear-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  })

  const meetLink =
    event.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri ?? ''

  return {
    meetLink,
    calendarEventId: event.data.id ?? null,
  }
}
