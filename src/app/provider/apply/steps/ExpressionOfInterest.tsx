'use client'

import { useState, useEffect } from 'react'
import type { Session } from 'next-auth'
import type { ApplicationData } from '../types'

interface Props {
  data: ApplicationData
  setData: (update: Partial<ApplicationData>) => void
  onNext: () => void
  session: Session | null
}

interface CityOption {
  id: string
  name: string
  slug: string
  state: string
}

type ProviderType = 'SOLO_COMPANION' | 'TEAM_OPERATOR' | 'PROFESSIONAL_ADVISOR'

const PROVIDER_TYPES: { value: ProviderType; label: string; sub: string }[] = [
  { value: 'SOLO_COMPANION', label: 'Solo Companion', sub: 'I will work independently' },
  { value: 'TEAM_OPERATOR', label: 'Team Operator', sub: 'I want to build a small team' },
  { value: 'PROFESSIONAL_ADVISOR', label: 'Professional Advisor', sub: 'I am a qualified professional' },
]

export default function ExpressionOfInterest({ data, setData, onNext, session }: Props) {
  const [cities, setCities] = useState<CityOption[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationData, string>>>({})

  const isPhoneFromSession = !!session?.user?.phone

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.json())
      .then((d: CityOption[]) => setCities(d))
      .catch(() => {
        setCities([
          { id: 'ahmedabad', name: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat' },
          { id: 'gandhinagar', name: 'Gandhinagar', slug: 'gandhinagar', state: 'Gujarat' },
        ])
      })
  }, [])

  function validate(): boolean {
    const e: Partial<Record<keyof ApplicationData, string>> = {}
    if (!data.legalName.trim()) e.legalName = 'Full legal name is required'
    if (!data.phone.trim() || !/^\d{10}$/.test(data.phone.replace(/\s/g, '')))
      e.phone = 'A valid 10-digit mobile number is required'
    if (!data.city) e.city = 'Please select your city'
    if (!data.whyThisWork.trim()) e.whyThisWork = 'Please tell us why you want to do this work'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validate()) onNext()
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Warm intro */}
      <div className="text-center py-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C2B3A] mb-2">
          Every NearDear Companion starts here.
        </h1>
        <p className="text-[#6B7280] text-base">
          Tell us who you are and what brings you here.
        </p>
      </div>

      {/* White card */}
      <div className="bg-white rounded-2xl p-5 space-y-5" style={{ border: '1px solid #E8E0D8' }}>

        {/* Legal Name */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
            Your full legal name <span className="text-[#E85D4A]">*</span>
          </label>
          <input
            type="text"
            value={data.legalName}
            onChange={(e) => setData({ legalName: e.target.value })}
            placeholder="As it appears on your Aadhaar card"
            className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
            style={{ border: errors.legalName ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
          />
          <p className="text-xs text-[#9CA3AF] mt-1">As it appears on your Aadhaar card</p>
          {errors.legalName && <p className="text-xs text-[#E85D4A] mt-1">{errors.legalName}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
            Mobile number <span className="text-[#E85D4A]">*</span>
          </label>
          <div className="flex items-center rounded-xl overflow-hidden" style={{ border: errors.phone ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}>
            <span className="px-3 py-3 text-sm text-[#6B7280] bg-[#F9F5F0] border-r border-[#E8E0D8] font-[family-name:var(--font-dm-mono)]">+91</span>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => !isPhoneFromSession && setData({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              readOnly={isPhoneFromSession}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`flex-1 px-4 py-3 text-[#1C2B3A] text-sm outline-none font-[family-name:var(--font-dm-mono)] ${isPhoneFromSession ? 'bg-[#F9F5F0] text-[#6B7280]' : 'bg-white'}`}
            />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">
            {isPhoneFromSession ? 'Pre-filled from your account' : 'We will verify this with an OTP'}
          </p>
          {errors.phone && <p className="text-xs text-[#E85D4A] mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
            Email address <span className="text-[#9CA3AF] font-normal">(optional)</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ email: e.target.value })}
            placeholder="your@email.com"
            className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
            style={{ border: '1.5px solid #E8E0D8' }}
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
            Which city will you serve in? <span className="text-[#E85D4A]">*</span>
          </label>
          <select
            value={data.city}
            onChange={(e) => setData({ city: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F] bg-white"
            style={{ border: errors.city ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
          >
            <option value="">Select your city</option>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <p className="text-xs text-[#9CA3AF] mt-1">NearDear is currently available in Ahmedabad and Gandhinagar.</p>
          {errors.city && <p className="text-xs text-[#E85D4A] mt-1">{errors.city}</p>}
        </div>

        {/* Provider Type */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
            How would you like to work? <span className="text-[#E85D4A]">*</span>
          </label>
          <div className="space-y-2">
            {PROVIDER_TYPES.map((pt) => {
              const selected = data.providerType === pt.value
              return (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setData({ providerType: pt.value })}
                  className="w-full text-left rounded-xl px-4 py-3 transition-all"
                  style={{
                    border: selected ? '2px solid #4A8C6F' : '1.5px solid #E8E0D8',
                    background: selected ? '#F0F7F4' : '#FFFFFF',
                  }}
                >
                  <p className="text-sm font-semibold text-[#1C2B3A]">{pt.label}</p>
                  <p className="text-xs text-[#6B7280]">{pt.sub}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Why This Work */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
            Why do you want to do this work? <span className="text-[#E85D4A]">*</span>
          </label>
          <textarea
            value={data.whyThisWork}
            onChange={(e) => setData({ whyThisWork: e.target.value })}
            placeholder="Tell us in your own words. There is no right or wrong answer. We just want to know what brings you here."
            rows={5}
            className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F] resize-none"
            style={{ border: errors.whyThisWork ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
          />
          <p className="text-xs text-[#6B7280] mt-1 italic">
            This is the most important question in the application. Please take your time.
          </p>
          {errors.whyThisWork && <p className="text-xs text-[#E85D4A] mt-1">{errors.whyThisWork}</p>}
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={handleNext}
        className="w-full rounded-xl py-4 text-white font-semibold text-base transition-opacity hover:opacity-90"
        style={{ background: '#4A8C6F' }}
      >
        Continue
      </button>
    </div>
  )
}
