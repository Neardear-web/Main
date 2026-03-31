'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'

type SosStatus = 'SEARCHING' | 'COMPANION_FOUND' | 'ADMIN_ALERTED' | 'RESOLVED' | 'FALLBACK'

interface StatusResponse {
  status: SosStatus
  area: string
  companionName?: string
  updatedAt: string
}

const copy = {
  EN: {
    // Stage 1
    s1Heading: 'We have received your request.',
    s1Body: (area: string) => `Searching for available companions in ${area} right now.`,
    s1Sub: 'You will receive an SMS within 5 minutes.',
    s1CaseId: 'Case ID:',
    // Stage 2
    s2Heading: (name: string) => `${name} is on their way to help you.`,
    s2Case: 'NearDear case:',
    s2Support: 'If you need us: support@neardear.in',
    // Stage 3
    s3Heading: 'We are sorry — no one is available at this exact moment.',
    s3Body: 'Our team has been personally alerted.\nSomeone will call you within 15 minutes.\nPlease keep your phone nearby.\nYou are not alone.',
    // Stage 4
    s4Heading: 'We were unable to find someone right now.',
    s4Sub: 'We are deeply sorry.',
    s4ResourcesTitle: 'You can also reach out to:',
    s4WhatsApp: 'Message us on WhatsApp',
    icall: { name: 'iCall', number: '9152987821', note: 'Free, available now' },
    vandrevala: { name: 'Vandrevala Foundation', number: '1860-2662-345', note: '24/7' },
    // Common
    loading: 'Loading…',
    error: 'Unable to load status. Please refresh.',
  },
  GU: {
    s1Heading: 'અમને તમારી વિનંતી મળી ગઈ છે.',
    s1Body: (area: string) => `${area} માં ઉપલબ્ધ સાથીઓ હમણાં શોધી રહ્યા છીએ.`,
    s1Sub: '5 મિનિટમાં SMS આવશે.',
    s1CaseId: 'કેસ ID:',
    s2Heading: (name: string) => `${name} તમારી મદદ માટે આવી રહ્યા છે.`,
    s2Case: 'NearDear કેસ:',
    s2Support: 'અમારો સંપર્ક: support@neardear.in',
    s3Heading: 'અમને ખેદ છે — આ ક્ષણે કોઈ ઉપલબ્ધ નથી.',
    s3Body: 'અમારી ટીમને જાણ કરી દેવામાં આવી છે.\n15 મિનિટમાં કોઈ ફોન કરશે.\nકૃપા કરી ફોન નજીક રાખો.\nતમે એકલા નથી.',
    s4Heading: 'અમે અત્યારે કોઈ શોધી શક્યા નહીં.',
    s4Sub: 'અમને ઊંડો ખેદ છે.',
    s4ResourcesTitle: 'તમે આ સ્થળોએ પણ સંપર્ક કરી શકો છો:',
    s4WhatsApp: 'WhatsApp પર સંદેશ કરો',
    icall: { name: 'iCall', number: '9152987821', note: 'નિઃશુલ્ક, ઉપલબ્ધ' },
    vandrevala: { name: 'Vandrevala Foundation', number: '1860-2662-345', note: '24/7' },
    loading: 'લોડ થઈ રહ્યું છે…',
    error: 'સ્ટેટસ લોડ થઈ શક્યો નહીં. કૃપા કરી રિફ્રેશ કરો.',
  },
  HI: {
    s1Heading: 'हमें आपका अनुरोध मिल गया है।',
    s1Body: (area: string) => `${area} में उपलब्ध साथियों को अभी खोज रहे हैं।`,
    s1Sub: '5 मिनट में SMS आएगा।',
    s1CaseId: 'केस ID:',
    s2Heading: (name: string) => `${name} आपकी मदद के लिए आ रहे हैं।`,
    s2Case: 'NearDear केस:',
    s2Support: 'संपर्क: support@neardear.in',
    s3Heading: 'हमें खेद है — इस समय कोई उपलब्ध नहीं है।',
    s3Body: 'हमारी टीम को सूचित कर दिया गया है।\n15 मिनट में कोई फोन करेगा।\nकृपया फोन पास रखें।\nआप अकेले नहीं हैं।',
    s4Heading: 'हम अभी कोई नहीं ढूंढ सके।',
    s4Sub: 'हमें गहरा खेद है।',
    s4ResourcesTitle: 'आप इन्हें भी संपर्क कर सकते हैं:',
    s4WhatsApp: 'WhatsApp पर संदेश करें',
    icall: { name: 'iCall', number: '9152987821', note: 'निःशुल्क, उपलब्ध' },
    vandrevala: { name: 'Vandrevala Foundation', number: '1860-2662-345', note: '24/7' },
    loading: 'लोड हो रहा है…',
    error: 'स्टेटस लोड नहीं हो सका। कृपया रिफ्रेश करें।',
  },
}

function SosSearchingContent() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const params = useSearchParams()
  const sosId = params.get('id') ?? ''

  const [data, setData] = useState<StatusResponse | null>(null)
  const [fetchError, setFetchError] = useState(false)

  const fetchStatus = useCallback(async () => {
    if (!sosId) return
    try {
      const res = await fetch(`/api/sos/${sosId}/status`)
      if (!res.ok) {
        setFetchError(true)
        return
      }
      const json = await res.json() as StatusResponse
      setData(json)
    } catch {
      setFetchError(true)
    }
  }, [sosId])

  useEffect(() => {
    fetchStatus()

    const interval = setInterval(() => {
      if (data?.status === 'COMPANION_FOUND' || data?.status === 'FALLBACK') {
        clearInterval(interval)
        return
      }
      fetchStatus()
    }, 10000)

    return () => clearInterval(interval)
  }, [fetchStatus, data?.status])

  const status = data?.status ?? 'SEARCHING'
  const area = data?.area ?? ''
  const companionName = data?.companionName ?? ''

  return (
    <div className="min-h-screen" style={{ background: '#FEF8F0' }}>
      {/* Top bar */}
      <div className="max-w-[560px] mx-auto px-4 pt-6 pb-2">
        <Link
          href="/"
          className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight"
          style={{ color: '#E07B2F' }}
        >
          NearDear
        </Link>
      </div>

      <div className="max-w-[560px] mx-auto px-4 pt-10 pb-16">
        {fetchError ? (
          <p className="text-center text-sm" style={{ color: '#6B7280' }}>
            {t.error}
          </p>
        ) : !data ? (
          <p className="text-center text-sm" style={{ color: '#9CA3AF' }}>
            {t.loading}
          </p>
        ) : (
          <>
            {/* STAGE 1 — SEARCHING */}
            {status === 'SEARCHING' && (
              <div className="text-center">
                {/* Animated pulse */}
                <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-8">
                  <div
                    className="absolute w-20 h-20 rounded-full animate-ping opacity-20"
                    style={{ background: '#E07B2F' }}
                  />
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: '#E07B2F' }}
                  >
                    <span className="text-white text-2xl">🔍</span>
                  </div>
                </div>

                <h1
                  className="font-[family-name:var(--font-playfair)] font-bold text-2xl mb-3"
                  style={{ color: '#1C2B3A' }}
                >
                  {t.s1Heading}
                </h1>
                <p className="text-base mb-2" style={{ color: '#374151' }}>
                  {t.s1Body(area)}
                </p>
                <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                  {t.s1Sub}
                </p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  {t.s1CaseId} {sosId}
                </p>
              </div>
            )}

            {/* STAGE 2 — COMPANION_FOUND */}
            {status === 'COMPANION_FOUND' && (
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-8 rounded-full" style={{ background: '#4A8C6F' }}>
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1
                  className="font-[family-name:var(--font-playfair)] font-bold text-2xl mb-3"
                  style={{ color: '#1C2B3A' }}
                >
                  {t.s2Heading(companionName)}
                </h1>
                <p className="text-sm mb-1" style={{ color: '#6B7280' }}>
                  {t.s2Case} {sosId}
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {t.s2Support}
                </p>
              </div>
            )}

            {/* STAGE 3 — ADMIN_ALERTED */}
            {status === 'ADMIN_ALERTED' && (
              <div
                className="rounded-2xl border-l-4 px-6 py-6 bg-white"
                style={{ borderColor: '#1A6B7A' }}
              >
                <h2
                  className="font-[family-name:var(--font-playfair)] font-semibold text-lg mb-3"
                  style={{ color: '#1C2B3A' }}
                >
                  {t.s3Heading}
                </h2>
                <p
                  className="text-sm leading-relaxed whitespace-pre-line"
                  style={{ color: '#374151' }}
                >
                  {t.s3Body}
                </p>
              </div>
            )}

            {/* STAGE 4 — FALLBACK */}
            {(status === 'FALLBACK' || status === 'RESOLVED') && (
              <div className="text-center">
                <h1
                  className="font-[family-name:var(--font-playfair)] font-bold text-2xl mb-2"
                  style={{ color: '#1C2B3A' }}
                >
                  {t.s4Heading}
                </h1>
                <p className="text-base mb-8" style={{ color: '#6B7280' }}>
                  {t.s4Sub}
                </p>

                <p className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: '#9CA3AF' }}>
                  {t.s4ResourcesTitle}
                </p>

                {/* Resource cards */}
                <div className="flex flex-col gap-3 mb-6">
                  <a
                    href={`tel:${t.icall.number}`}
                    className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-left">
                      <p className="font-semibold text-sm" style={{ color: '#1C2B3A' }}>{t.icall.name}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{t.icall.note}</p>
                    </div>
                    <span className="font-semibold text-sm" style={{ color: '#1A6B7A' }}>{t.icall.number}</span>
                  </a>
                  <a
                    href={`tel:${t.vandrevala.number.replace(/-/g, '')}`}
                    className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-left">
                      <p className="font-semibold text-sm" style={{ color: '#1C2B3A' }}>{t.vandrevala.name}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{t.vandrevala.note}</p>
                    </div>
                    <span className="font-semibold text-sm" style={{ color: '#1A6B7A' }}>{t.vandrevala.number}</span>
                  </a>
                </div>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/91XXXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: '#25D366' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t.s4WhatsApp}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function SosSearchingPage() {
  return (
    <Suspense>
      <SosSearchingContent />
    </Suspense>
  )
}
