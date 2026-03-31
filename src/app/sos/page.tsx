'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/lib/language'

const copy = {
  EN: {
    heading: 'We are here.',
    subheading:
      'Tell us where you are and what you need.\nWe will find someone as fast as we can.',
    phoneLabel: 'Your phone number',
    areaLabel: 'Where in Ahmedabad are you?',
    areaPlaceholder:
      'e.g. Navrangpura, Bopal, Satellite, Maninagar, Paldi…',
    areaNote: 'We will find companions nearest to you',
    descLabel: 'What do you need right now?',
    descPlaceholder:
      "Just a few words is enough. e.g. Someone to sit with my mother, I just arrived and need help, Someone at my father's door right now\u2026",
    submitIdle: 'Find someone now →',
    submitLoading: 'Searching…',
    disclaimer:
      '⚠ This is not a medical emergency service. For medical emergencies call 112 immediately.',
    trust:
      'All companions on NearDear are verified. This request is reviewed by our team.',
    charLimit: (n: number) => `${n}/500`,
    errorPhone: 'Please enter your phone number',
    errorArea: 'Please tell us where you are',
    errorDesc: 'Please tell us what you need',
    errorServer: 'Something went wrong. Please try again.',
  },
  GU: {
    heading: 'અમે અહીં છીએ.',
    subheading:
      'અમને જણાવો કે તમે ક્યાં છો અને શું જોઈએ છે.\nઅમે જલ્દીથી કોઈને શોધીશું.',
    phoneLabel: 'તમારો ફોન નંબર',
    areaLabel: 'તમે અમદાવાદમાં ક્યાં છો?',
    areaPlaceholder: 'દા.ત. નવરંગપુરા, બોપલ, સેટેલાઇટ, મણિનગર, પાલડી…',
    areaNote: 'અમે તમારી નજીકના સાથીઓ શોધીશું',
    descLabel: 'તમને હમણાં શું જોઈએ છે?',
    descPlaceholder:
      'થોડા શબ્દો પૂરતા છે. દા.ત. મારી માતા સાથે બેસવા કોઈ જોઈએ, હું હમણાં આવ્યો છું અને મદદ જોઈએ…',
    submitIdle: 'કોઈને શોધો →',
    submitLoading: 'શોધી રહ્યા છીએ…',
    disclaimer:
      '⚠ આ તબીબી ઇમરજન્સી સેવા નથી. તબીબી ઇમરજન્સી માટે તરત 112 ડાયલ કરો.',
    trust:
      'NearDear ના તમામ સાથીઓ ચકાસાયેલા છે. આ વિનંતી અમારી ટીમ દ્વારા સમીક્ષા કરવામાં આવે છે.',
    charLimit: (n: number) => `${n}/500`,
    errorPhone: 'કૃપા કરી ફોન નંબર દાખલ કરો',
    errorArea: 'કૃપા કરી તમે ક્યાં છો તે જણાવો',
    errorDesc: 'કૃપા કરી તમને શું જોઈએ તે જણાવો',
    errorServer: 'કંઈ ખોટું થઈ ગયું. ફરી પ્રયાસ કરો.',
  },
  HI: {
    heading: 'हम यहां हैं।',
    subheading:
      'हमें बताएं आप कहां हैं और क्या चाहिए।\nहम जितना जल्दी हो सके कोई ढूंढेंगे।',
    phoneLabel: 'आपका फोन नंबर',
    areaLabel: 'आप अहमदाबाद में कहां हैं?',
    areaPlaceholder: 'जैसे नवरंगपुरा, बोपल, सैटेलाइट, मणिनगर, पाल्डी…',
    areaNote: 'हम आपके सबसे नजदीकी साथी ढूंढेंगे',
    descLabel: 'आपको अभी क्या चाहिए?',
    descPlaceholder:
      'कुछ शब्द काफी हैं। जैसे मेरी माँ के साथ कोई बैठे, मैं अभी आया हूं और मदद चाहिए…',
    submitIdle: 'अभी कोई खोजें →',
    submitLoading: 'खोज रहे हैं…',
    disclaimer:
      '⚠ यह मेडिकल इमरजेंसी सेवा नहीं है। मेडिकल इमरजेंसी के लिए तुरंत 112 डायल करें।',
    trust:
      'NearDear के सभी साथी सत्यापित हैं। यह अनुरोध हमारी टीम द्वारा समीक्षित होता है।',
    charLimit: (n: number) => `${n}/500`,
    errorPhone: 'कृपया अपना फोन नंबर दर्ज करें',
    errorArea: 'कृपया बताएं आप कहां हैं',
    errorDesc: 'कृपया बताएं आपको क्या चाहिए',
    errorServer: 'कुछ गलत हो गया। फिर से प्रयास करें।',
  },
}

export default function SosPage() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const router = useRouter()
  const { data: session } = useSession()

  // Pre-fill phone from session if logged in
  const sessionPhone = (session?.user as { phone?: string })?.phone ?? ''
  const [phone, setPhone] = useState(sessionPhone.replace(/^\+91/, ''))
  const [area, setArea] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ phone?: string; area?: string; desc?: string; server?: string }>({})

  function validate() {
    const e: typeof errors = {}
    if (!phone.trim()) e.phone = t.errorPhone
    if (!area.trim()) e.area = t.errorArea
    if (!description.trim()) e.desc = t.errorDesc
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+91${phone.trim()}`,
          area: area.trim(),
          description: description.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrors({ server: (data as { error?: string }).error ?? t.errorServer })
        setLoading(false)
        return
      }

      const { sosId } = await res.json() as { sosId: string }
      router.push(`/sos/searching?id=${sosId}`)
    } catch {
      setErrors({ server: t.errorServer })
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: '#FEF8F0' }}
    >
      {/* Top bar */}
      <div className="max-w-[560px] mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight"
          style={{ color: '#E07B2F' }}
        >
          NearDear
        </Link>
        <LanguageToggle />
      </div>

      {/* Main content */}
      <div className="max-w-[560px] mx-auto px-4 pt-8 pb-16">
        {/* Heading */}
        <h1
          className="font-[family-name:var(--font-playfair)] font-bold leading-tight mb-3"
          style={{ fontSize: '32px', color: '#1C2B3A' }}
        >
          {t.heading}
        </h1>
        <p
          className="mb-8 whitespace-pre-line"
          style={{ fontSize: '18px', color: '#6B7280' }}
        >
          {t.subheading}
        </p>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate>
            {/* Field 1 — Phone */}
            <div className="mb-6">
              <label
                htmlFor="sos-phone"
                className="block text-sm font-medium mb-2"
                style={{ color: '#1C2B3A' }}
              >
                {t.phoneLabel}
              </label>
              <div
                className="flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#E07B2F] focus-within:ring-opacity-40"
                style={{
                  borderColor: errors.phone ? '#E85D4A' : '#E8E0D8',
                  background: '#FAFAFA',
                }}
              >
                <span
                  className="px-3 py-3 text-sm font-medium border-r select-none"
                  style={{ color: '#1C2B3A', borderColor: '#E8E0D8', background: '#F3EDE6' }}
                >
                  +91
                </span>
                <input
                  id="sos-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setPhone(val)
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }))
                  }}
                  placeholder="98765 43210"
                  className="flex-1 px-3 py-3 text-sm bg-transparent outline-none"
                  style={{ color: '#1C2B3A' }}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs" style={{ color: '#E85D4A' }}>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Field 2 — Area */}
            <div className="mb-6">
              <label
                htmlFor="sos-area"
                className="block text-sm font-medium mb-2"
                style={{ color: '#1C2B3A' }}
              >
                {t.areaLabel}
              </label>
              <input
                id="sos-area"
                type="text"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value)
                  if (errors.area) setErrors((p) => ({ ...p, area: undefined }))
                }}
                placeholder={t.areaPlaceholder}
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E07B2F] focus:ring-opacity-40"
                style={{
                  borderColor: errors.area ? '#E85D4A' : '#E8E0D8',
                  background: '#FAFAFA',
                  color: '#1C2B3A',
                }}
              />
              {errors.area ? (
                <p className="mt-1 text-xs" style={{ color: '#E85D4A' }}>
                  {errors.area}
                </p>
              ) : (
                <p className="mt-1 text-xs" style={{ color: '#9CA3AF' }}>
                  {t.areaNote}
                </p>
              )}
            </div>

            {/* Field 3 — Description */}
            <div className="mb-8">
              <label
                htmlFor="sos-desc"
                className="block text-sm font-medium mb-2"
                style={{ color: '#1C2B3A' }}
              >
                {t.descLabel}
              </label>
              <textarea
                id="sos-desc"
                rows={4}
                maxLength={500}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.desc) setErrors((p) => ({ ...p, desc: undefined }))
                }}
                placeholder={t.descPlaceholder}
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E07B2F] focus:ring-opacity-40 resize-none"
                style={{
                  borderColor: errors.desc ? '#E85D4A' : '#E8E0D8',
                  background: '#FAFAFA',
                  color: '#1C2B3A',
                }}
              />
              <div className="flex justify-between mt-1">
                {errors.desc ? (
                  <p className="text-xs" style={{ color: '#E85D4A' }}>
                    {errors.desc}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-xs ml-auto" style={{ color: '#9CA3AF' }}>
                  {t.charLimit(description.length)}
                </p>
              </div>
            </div>

            {/* Server error */}
            {errors.server && (
              <p
                className="mb-4 text-sm text-center rounded-xl px-4 py-3"
                style={{ color: '#E85D4A', background: '#FFF5F4', border: '1px solid #FECACA' }}
              >
                {errors.server}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#E07B2F' }}
            >
              {loading ? t.submitLoading : t.submitIdle}
            </button>
          </form>

          {/* Disclaimer — ONLY place Soft Coral is used */}
          <p
            className="mt-5 text-xs text-center leading-relaxed"
            style={{ color: '#E85D4A' }}
          >
            {t.disclaimer}
          </p>

          {/* Trust note */}
          <p
            className="mt-2 text-xs text-center leading-relaxed"
            style={{ color: '#9CA3AF' }}
          >
            {t.trust}
          </p>
        </div>
      </div>
    </div>
  )
}
