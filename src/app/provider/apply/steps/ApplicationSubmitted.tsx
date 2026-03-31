'use client'

import Link from 'next/link'

interface Props {
  legalName: string
  applicationId: string
}

const TIMELINE = [
  { label: 'Application received', detail: 'Today', done: true },
  { label: 'Identity verification', detail: '1–2 days', done: false },
  { label: 'We call your references', detail: '2–3 days', done: false },
  { label: 'Video interview', detail: '3–5 days', done: false },
  { label: 'Orientation modules', detail: 'After interview', done: false },
  { label: 'Account activated', detail: '5–10 days', done: false },
]

export default function ApplicationSubmitted({ legalName, applicationId }: Props) {
  const whatsappText = encodeURIComponent(
    'I just applied to become a NearDear companion! If you or someone you know needs trusted human help, visit neardear.in'
  )
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`

  return (
    <div className="space-y-8 pt-4">
      {/* Checkmark */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 80, height: 80, background: '#4A8C6F' }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M10 20l8 8 14-16"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C2B3A]">
            Thank you, {legalName}.
          </h1>
          <p className="text-base text-[#4A8C6F] font-semibold mt-1">
            Your application has been received.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E0D8' }}>
        <h2 className="text-sm font-semibold text-[#1A6B7A] mb-4">What happens next</h2>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-2.5 top-3 bottom-3"
            style={{ width: 2, background: '#E8E0D8' }}
          />
          <div className="space-y-5">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div
                  className="flex-shrink-0 rounded-full z-10"
                  style={{
                    width: 16,
                    height: 16,
                    marginTop: 2,
                    background: item.done ? '#4A8C6F' : '#FFFFFF',
                    border: item.done ? '3px solid #4A8C6F' : '2px solid #E8E0D8',
                  }}
                />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${item.done ? 'text-[#4A8C6F]' : 'text-[#1C2B3A]'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SMS notice */}
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: '#F0F7F4', border: '1px solid #4A8C6F' }}
      >
        <p className="text-sm text-[#1C2B3A]">
          We will keep you updated by SMS at every step.
        </p>
        {applicationId && (
          <p className="text-xs text-[#6B7280] mt-1 font-[family-name:var(--font-dm-mono)]">
            Application reference: {applicationId}
          </p>
        )}
      </div>

      {/* Share */}
      <div className="bg-white rounded-2xl p-5 space-y-3" style={{ border: '1px solid #E8E0D8' }}>
        <p className="text-sm font-semibold text-[#1C2B3A] text-center">
          While you wait — tell someone you know about NearDear.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-white font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: '#25D366' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share NearDear on WhatsApp
        </a>
        <Link
          href="/"
          className="flex items-center justify-center w-full rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ border: '1.5px solid #E8E0D8', color: '#1C2B3A' }}
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}
