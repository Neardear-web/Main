'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language'

// Returns a formatted string showing the selected time in both IST and the
// user's local timezone. If the user is already in IST, only IST is shown.
function formatDualTimezone(isoDatetimeLocal: string): string {
  if (!isoDatetimeLocal) return ''

  // The datetime-local input value is always in local browser time
  const localDate = new Date(isoDatetimeLocal)
  if (isNaN(localDate.getTime())) return ''

  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone

  const fmtIST = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const istStr = fmtIST.format(localDate) + ' IST'

  // Only show user's timezone if it is different from IST
  if (userTz === 'Asia/Kolkata') return istStr

  const fmtUser = new Intl.DateTimeFormat('en-US', {
    timeZone: userTz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  })

  const userStr = fmtUser.format(localDate)
  return `${istStr}  ·  ${userStr} (your time)`
}

interface Props {
  requestId: string
  companionName: string
  companionUserId: string
  guestUserId: string
}

const copy = {
  EN: {
    heading: 'Before the first visit',
    body: (name: string) =>
      `Would you like a quick 15-minute intro call to meet ${name} face to face?`,
    hint: 'Many families feel more comfortable after a brief video introduction.',
    yes: '✓  Yes — schedule intro call',
    no: '→  No — proceed to payment',
    schedulingHeading: 'When would you like the call?',
    dateLabel: 'Select a date and time',
    confirm: 'Confirm intro call',
    confirming: 'Scheduling…',
    skip: 'Skip and go to payment',
    scheduled: 'Intro call scheduled!',
    scheduledBody: (name: string) =>
      `You will receive a Google Meet link shortly. The call with ${name} is confirmed.`,
    proceedToPayment: 'Proceed to payment →',
  },
  GU: {
    heading: 'પ્રથમ મુલાકાત પહેલા',
    body: (name: string) =>
      `${name} સાથે 15 મિનિટની ટૂંકી ઓળખ કૉલ કરવા ઈચ્છો છો?`,
    hint: 'ઘણા પરિવારો ટૂંકા વીડિયો પરિચય પછી વધુ સ્વસ્થ અનુભવે છે.',
    yes: '✓  હા — ઓળખ કૉલ ગોઠવો',
    no: '→  ના — ચુકવણી કરો',
    schedulingHeading: 'ક્યારે વાત કરવી છે?',
    dateLabel: 'તારીખ અને સમય પસંદ કરો',
    confirm: 'ઓળખ કૉલ નક્કી કરો',
    confirming: 'ગોઠવી રહ્યા છે…',
    skip: 'છોડો અને ચુકવણી કરો',
    scheduled: 'ઓળખ કૉલ ગોઠવાઈ ગઈ!',
    scheduledBody: (name: string) =>
      `ટૂંક સમયમાં Google Meet લિંક મળશે. ${name} સાથેની કૉલ નક્કી થઈ.`,
    proceedToPayment: 'ચુકવણી કરો →',
  },
  HI: {
    heading: 'पहली मुलाकात से पहले',
    body: (name: string) =>
      `क्या आप ${name} से 15 मिनट की परिचय कॉल करना चाहेंगे?`,
    hint: 'कई परिवार एक छोटी वीडियो परिचय के बाद अधिक सहज महसूस करते हैं।',
    yes: '✓  हां — परिचय कॉल शेड्यूल करें',
    no: '→  नहीं — भुगतान करें',
    schedulingHeading: 'कब बात करनी है?',
    dateLabel: 'तारीख और समय चुनें',
    confirm: 'परिचय कॉल नक्की करें',
    confirming: 'शेड्यूल हो रहा है…',
    skip: 'छोड़ें और भुगतान करें',
    scheduled: 'परिचय कॉल शेड्यूल हो गई!',
    scheduledBody: (name: string) =>
      `जल्द ही Google Meet लिंक मिलेगा। ${name} के साथ कॉल नक्की हो गई।`,
    proceedToPayment: 'भुगतान करें →',
  },
}

type Stage = 'PROMPT' | 'SCHEDULING' | 'SCHEDULED' | 'SKIPPED'

export default function IntroCallPrompt({
  requestId,
  companionName,
  companionUserId,
  guestUserId: _guestUserId,
}: Props) {
  const { lang } = useLanguage()
  const t = copy[lang]
  const router = useRouter()

  const [stage, setStage] = useState<Stage>('PROMPT')
  const [scheduledAt, setScheduledAt] = useState('')
  const [dualTzLabel, setDualTzLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [meetLink, setMeetLink] = useState('')

  useEffect(() => {
    setDualTzLabel(formatDualTimezone(scheduledAt))
  }, [scheduledAt])

  // Minimum datetime: 30 minutes from now
  const minDateTime = new Date(Date.now() + 30 * 60 * 1000)
    .toISOString()
    .slice(0, 16)

  async function handleSchedule() {
    if (!scheduledAt) {
      setError('Please select a date and time.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/meetings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingType: 'INTRO_CALL',
          requestId,
          guestUserId: companionUserId,
          scheduledAt: new Date(scheduledAt).toISOString(),
          durationMinutes: 15,
        }),
      })
      const data = (await res.json()) as { meetLink?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setMeetLink(data.meetLink ?? '')
      setStage('SCHEDULED')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function goToPayment() {
    router.push(`/request/${requestId}/payment`)
  }

  if (stage === 'SKIPPED') {
    goToPayment()
    return null
  }

  if (stage === 'SCHEDULED') {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'white', border: '2px solid #E07B2F' }}
      >
        <div className="text-4xl mb-3">📹</div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: '#1C2B3A', fontFamily: 'Georgia, serif' }}
        >
          {t.scheduled}
        </h2>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
          {t.scheduledBody(companionName)}
        </p>
        {meetLink && (
          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-4 text-sm font-medium underline"
            style={{ color: '#1A6B7A' }}
          >
            {meetLink}
          </a>
        )}
        <button
          onClick={goToPayment}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm"
          style={{ background: '#E07B2F' }}
        >
          {t.proceedToPayment}
        </button>
      </div>
    )
  }

  if (stage === 'SCHEDULING') {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: 'white', border: '1px solid #E8E0D8' }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: '#1C2B3A', fontFamily: 'Georgia, serif' }}
        >
          {t.schedulingHeading}
        </h2>

        <label className="block text-sm font-medium mb-1" style={{ color: '#1C2B3A' }}>
          {t.dateLabel}
        </label>
        <input
          type="datetime-local"
          min={minDateTime}
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E07B2F] focus:border-transparent"
          style={{ borderColor: '#E8E0D8', color: '#1C2B3A' }}
        />
        {dualTzLabel && (
          <p className="text-xs mt-1 mb-4 font-medium" style={{ color: '#1A6B7A' }}>
            🕐 {dualTzLabel}
          </p>
        )}
        {!dualTzLabel && <div className="mb-4" />}

        {error && (
          <p className="text-sm mb-3" style={{ color: '#E85D4A' }}>{error}</p>
        )}

        <button
          onClick={handleSchedule}
          disabled={loading || !scheduledAt}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm mb-3 disabled:opacity-50 transition-opacity"
          style={{ background: '#E07B2F' }}
        >
          {loading ? t.confirming : t.confirm}
        </button>

        <button
          onClick={() => setStage('PROMPT')}
          className="w-full py-2 rounded-xl text-sm font-medium"
          style={{ color: '#6B7280' }}
        >
          ← Back
        </button>
      </div>
    )
  }

  // PROMPT stage
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'white', border: '1px solid #E8E0D8' }}
    >
      {/* Companion avatar + name */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ background: '#4A8C6F' }}
        >
          {companionName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#1C2B3A' }}>
            {companionName}
          </p>
          <p className="text-xs" style={{ color: '#1A6B7A' }}>
            ✓ Verified Companion
          </p>
        </div>
      </div>

      <h2
        className="text-lg font-semibold mb-2"
        style={{ color: '#1C2B3A', fontFamily: 'Georgia, serif' }}
      >
        {t.heading}
      </h2>
      <p className="text-sm mb-2" style={{ color: '#1C2B3A' }}>
        {t.body(companionName)}
      </p>
      <p className="text-xs mb-5" style={{ color: '#9CA3AF' }}>
        {t.hint}
      </p>

      <button
        onClick={() => setStage('SCHEDULING')}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm mb-3 hover:opacity-90 transition-opacity"
        style={{ background: '#E07B2F' }}
      >
        {t.yes}
      </button>

      <button
        onClick={() => setStage('SKIPPED')}
        className="w-full py-3 rounded-xl text-sm font-medium border hover:bg-gray-50 transition-colors"
        style={{ borderColor: '#E8E0D8', color: '#6B7280' }}
      >
        {t.no}
      </button>
    </div>
  )
}
