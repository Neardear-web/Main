'use client'

import { useEffect, useState } from 'react'
import type { FlowData } from '../types'

interface City {
  id: string
  name: string
  slug: string
  state: string
}

interface Props {
  flowData: FlowData
  setFlowData: (data: Partial<FlowData>) => void
  onNext: () => void
  onBack: () => void
  isForSelf: boolean
}

const AGE_RANGES = [
  'Under 60',
  '60–65',
  '66–70',
  '71–75',
  '76–80',
  '81–85',
  'Above 85',
]

const LANGUAGES = ['Gujarati', 'Hindi', 'English', 'Other']

const GENDER_OPTIONS: {
  value: 'FEMALE' | 'MALE' | 'NO_PREFERENCE'
  label: string
  hint: string
}[] = [
  {
    value: 'FEMALE',
    label: 'Female companion preferred',
    hint: 'Preferred by many families for home visits',
  },
  {
    value: 'MALE',
    label: 'Male companion preferred',
    hint: '',
  },
  {
    value: 'NO_PREFERENCE',
    label: 'No preference',
    hint: 'Show me all available companions',
  },
]

const MOBILITY_OPTIONS = [
  { value: 'INDEPENDENT', label: 'Independent', hint: 'Moves around freely' },
  { value: 'NEEDS_SUPPORT', label: 'Needs support', hint: 'Can walk with help' },
  { value: 'WHEELCHAIR', label: 'Uses wheelchair', hint: '' },
  { value: 'BEDRIDDEN', label: 'Bedridden', hint: 'Needs full care' },
]

const PERSONAL_CARE_OPTIONS = [
  { value: 'BATHING', label: 'Help with bathing' },
  { value: 'DRESSING', label: 'Help with dressing' },
  { value: 'DIAPER_CHANGE', label: 'Diaper / pad changes' },
  { value: 'FEEDING', label: 'Help with eating / feeding' },
  { value: 'MEDICATION_REMINDERS', label: 'Medication reminders' },
  { value: 'MEDICATION_DISPENSING', label: 'Medication dispensing' },
]

const MEDICAL_EQUIPMENT_OPTIONS = [
  { value: 'WHEELCHAIR', label: 'Wheelchair' },
  { value: 'WALKER', label: 'Walker' },
  { value: 'OXYGEN', label: 'Oxygen concentrator' },
  { value: 'HOSPITAL_BED', label: 'Hospital bed' },
  { value: 'FEEDING_TUBE', label: 'Feeding tube' },
  { value: 'CATHETER', label: 'Catheter' },
  { value: 'NONE', label: 'None of the above' },
]

const CARE_HOURS_OPTIONS = [
  { value: '2_4', label: '2–4 hours' },
  { value: '4_6', label: '4–6 hours' },
  { value: '6_8', label: '6–8 hours' },
  { value: 'FULL_DAY', label: 'Full day' },
  { value: 'NIGHT_SHIFT', label: 'Night shift' },
  { value: 'LIVE_IN', label: 'Live-in' },
]

const CARE_FREQUENCY_OPTIONS = [
  { value: 'ONE_TIME', label: 'One time or short visit' },
  { value: 'SHORT_TERM', label: 'A few weeks' },
  { value: 'MEDIUM_TERM', label: 'A few months' },
  { value: 'LONG_TERM', label: 'Ongoing long-term' },
]

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="text-sm mt-1" style={{ color: '#E85D4A' }}>
      {msg}
    </p>
  )
}

function inputClass(hasError: boolean) {
  return [
    'w-full rounded-lg px-3 py-2.5 text-[#1C2B3A] text-sm outline-none transition-colors',
    'border',
    hasError ? 'border-[#E85D4A]' : 'border-[#E8E0D8]',
    'focus:border-[#1A6B7A]',
    'bg-white',
  ].join(' ')
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-2.5 transition-all"
      style={{
        border: checked ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
        background: checked ? '#F0F7F4' : '#FFFFFF',
      }}
    >
      <div
        className="flex-shrink-0 rounded flex items-center justify-center"
        style={{
          width: 20,
          height: 20,
          background: checked ? '#4A8C6F' : '#FFFFFF',
          border: checked ? '2px solid #4A8C6F' : '2px solid #E8E0D8',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-[#1C2B3A]">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    </label>
  )
}

export default function ElderProfile({
  flowData,
  setFlowData,
  onNext,
  onBack,
  isForSelf,
}: Props) {
  const [cities, setCities] = useState<City[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.json())
      .then((data: City[]) => setCities(data))
      .catch(() => {})
  }, [])

  const title = isForSelf
    ? 'About you'
    : flowData.whoNeedsHelp === 'PARENT'
      ? 'About your parent'
      : 'About the person you are booking for'

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!flowData.elderName.trim()) e.elderName = 'Name is required'
    if (!flowData.elderCity) e.elderCity = 'City is required'
    if (!flowData.elderAgeRange) e.elderAgeRange = 'Age range is required'
    if (!flowData.elderPrimaryLanguage)
      e.elderPrimaryLanguage = 'Language is required'
    if (!flowData.emergencyContactName.trim())
      e.emergencyContactName = 'Emergency contact name is required'
    if (!flowData.emergencyContactPhone.trim())
      e.emergencyContactPhone = 'Emergency contact phone is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validate()) onNext()
  }

  function togglePersonalCareNeed(val: string) {
    const current = flowData.elderPersonalCareNeeds
    setFlowData({
      elderPersonalCareNeeds: current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val],
    })
  }

  function toggleMedicalEquipment(val: string) {
    const current = flowData.elderMedicalEquipment
    if (val === 'NONE') {
      // Toggle "None" — clears all others
      setFlowData({ elderMedicalEquipment: current.includes('NONE') ? [] : ['NONE'] })
      return
    }
    const withoutNone = current.filter((v) => v !== 'NONE')
    setFlowData({
      elderMedicalEquipment: withoutNone.includes(val)
        ? withoutNone.filter((v) => v !== val)
        : [...withoutNone, val],
    })
  }

  const isNotIndependent =
    flowData.elderMobilityLevel !== '' &&
    flowData.elderMobilityLevel !== 'INDEPENDENT'

  const nameLabel = isForSelf ? 'Your name' : 'Their name'

  return (
    <div>
      <h2
        className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-2"
        style={{ fontSize: 26 }}
      >
        {title}
      </h2>
      <p className="text-[#6B7280] text-sm mb-6">
        This helps us find the right companion.
      </p>

      <div
        className="rounded-2xl shadow-sm p-6 mb-4 flex flex-col gap-5"
        style={{ background: '#FFFFFF' }}
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            {nameLabel} <span style={{ color: '#E85D4A' }}>*</span>
          </label>
          <input
            type="text"
            className={inputClass(!!errors.elderName)}
            placeholder="Full name"
            value={flowData.elderName}
            onChange={(e) => setFlowData({ elderName: e.target.value })}
          />
          <FieldError msg={errors.elderName} />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            Which city do they live in? <span style={{ color: '#E85D4A' }}>*</span>
          </label>
          <select
            className={inputClass(!!errors.elderCity)}
            value={flowData.elderCity}
            onChange={(e) => setFlowData({ elderCity: e.target.value })}
          >
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-[#9CA3AF] mt-1">
            NearDear is currently available in Ahmedabad and Gandhinagar.
          </p>
          <FieldError msg={errors.elderCity} />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            Their phone number (optional)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280] font-medium">+91</span>
            <input
              type="tel"
              className={inputClass(false)}
              placeholder="10-digit number"
              value={flowData.elderPhone}
              onChange={(e) => setFlowData({ elderPhone: e.target.value })}
            />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">
            If provided, we will send them a one-time consent message.
          </p>
        </div>

        {/* Age range */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            Age range <span style={{ color: '#E85D4A' }}>*</span>
          </label>
          <select
            className={inputClass(!!errors.elderAgeRange)}
            value={flowData.elderAgeRange}
            onChange={(e) => setFlowData({ elderAgeRange: e.target.value })}
          >
            <option value="">Select age range</option>
            {AGE_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <FieldError msg={errors.elderAgeRange} />
        </div>

        {/* Primary language */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            Primary language <span style={{ color: '#E85D4A' }}>*</span>
          </label>
          <select
            className={inputClass(!!errors.elderPrimaryLanguage)}
            value={flowData.elderPrimaryLanguage}
            onChange={(e) =>
              setFlowData({ elderPrimaryLanguage: e.target.value })
            }
          >
            <option value="">Select language</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <FieldError msg={errors.elderPrimaryLanguage} />
        </div>

        {/* Health notes */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            Health or mobility notes
          </label>
          <textarea
            rows={3}
            className={inputClass(false) + ' resize-none'}
            placeholder="Anything the companion should know — health conditions, mobility, preferences, allergies"
            value={flowData.elderHealthNotes}
            onChange={(e) => setFlowData({ elderHealthNotes: e.target.value })}
          />
        </div>

        {/* Emergency contact name */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            Emergency contact name <span style={{ color: '#E85D4A' }}>*</span>
          </label>
          <input
            type="text"
            className={inputClass(!!errors.emergencyContactName)}
            placeholder="Full name"
            value={flowData.emergencyContactName}
            onChange={(e) =>
              setFlowData({ emergencyContactName: e.target.value })
            }
          />
          <FieldError msg={errors.emergencyContactName} />
        </div>

        {/* Emergency contact phone */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            Emergency contact phone <span style={{ color: '#E85D4A' }}>*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280] font-medium">+91</span>
            <input
              type="tel"
              className={inputClass(!!errors.emergencyContactPhone)}
              placeholder="10-digit number"
              value={flowData.emergencyContactPhone}
              onChange={(e) =>
                setFlowData({ emergencyContactPhone: e.target.value })
              }
            />
          </div>
          <FieldError msg={errors.emergencyContactPhone} />
        </div>

        {/* Gender preference */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-0.5">
            Companion gender preference
          </label>
          <p className="text-xs text-[#6B7280] mb-3">
            (for home visits and personal care)
          </p>
          <div className="flex flex-col gap-3">
            {GENDER_OPTIONS.map((opt) => {
              const isSelected = flowData.genderPreference === opt.value
              return (
                <label
                  key={opt.value}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="genderPreference"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() =>
                      setFlowData({ genderPreference: opt.value })
                    }
                    className="mt-0.5 accent-[#E07B2F]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#1C2B3A]">
                      {opt.label}
                    </p>
                    {opt.hint && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {opt.hint}
                      </p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
          <p className="text-xs text-[#9CA3AF] mt-3">
            This preference applies to all services for this person. Can be
            changed anytime.
          </p>
        </div>
      </div>

      {/* ── Care needs section ─────────────────────────── */}
      <div
        className="rounded-2xl shadow-sm p-6 mb-4 flex flex-col gap-5"
        style={{ background: '#FFFFFF' }}
      >
        {/* Section header with warm note */}
        <div>
          <h3
            className="font-[family-name:var(--font-playfair)] font-semibold text-[#1C2B3A] mb-1"
            style={{ fontSize: 18 }}
          >
            Care needs{' '}
            <span className="text-sm font-normal text-[#9CA3AF]">
              (optional — but helpful for matching)
            </span>
          </h3>
          <p
            className="text-sm rounded-xl px-4 py-3 mt-2"
            style={{ background: '#F8F4EE', color: '#6B7280' }}
          >
            These details help us find the right companion for your elder&rsquo;s specific
            needs. All information is kept private and only shared with matched companions.
          </p>
        </div>

        {/* 1. Mobility level */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-2">
            Mobility level
          </label>
          <div className="flex flex-col gap-2">
            {MOBILITY_OPTIONS.map((opt) => {
              const isSelected = flowData.elderMobilityLevel === opt.value
              return (
                <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="mobilityLevel"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => {
                      setFlowData({ elderMobilityLevel: opt.value })
                      // Clear personal care needs if switching to independent
                      if (opt.value === 'INDEPENDENT') {
                        setFlowData({ elderPersonalCareNeeds: [] })
                      }
                    }}
                    className="mt-0.5 accent-[#E07B2F]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#1C2B3A]">{opt.label}</p>
                    {opt.hint && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{opt.hint}</p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* 2. Personal care needs — shown only if not independent */}
        {isNotIndependent && (
          <div>
            <label className="block text-sm font-semibold text-[#1A6B7A] mb-2">
              Personal care needs
            </label>
            <div className="flex flex-col gap-2">
              {PERSONAL_CARE_OPTIONS.map((opt) => (
                <CheckItem
                  key={opt.value}
                  label={opt.label}
                  checked={flowData.elderPersonalCareNeeds.includes(opt.value)}
                  onChange={() => togglePersonalCareNeed(opt.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Medical equipment at home */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-2">
            Medical equipment at home
          </label>
          <div className="flex flex-col gap-2">
            {MEDICAL_EQUIPMENT_OPTIONS.map((opt) => (
              <CheckItem
                key={opt.value}
                label={opt.label}
                checked={flowData.elderMedicalEquipment.includes(opt.value)}
                onChange={() => toggleMedicalEquipment(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* 4. Care hours needed per day */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
            Care hours needed per day
          </label>
          <select
            className={inputClass(false)}
            value={flowData.elderCareHoursPerDay}
            onChange={(e) => setFlowData({ elderCareHoursPerDay: e.target.value })}
          >
            <option value="">Select…</option>
            {CARE_HOURS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. How long is this needed */}
        <div>
          <label className="block text-sm font-semibold text-[#1A6B7A] mb-2">
            How long is this needed?
          </label>
          <div className="flex flex-col gap-2">
            {CARE_FREQUENCY_OPTIONS.map((opt) => {
              const isSelected = flowData.elderCareFrequency === opt.value
              return (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="careFrequency"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => setFlowData({ elderCareFrequency: opt.value })}
                    className="accent-[#E07B2F]"
                  />
                  <span className="text-sm text-[#1C2B3A]">{opt.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border font-semibold text-[#1C2B3A] transition-colors hover:bg-[#E8E0D8]"
          style={{ borderColor: '#E8E0D8', fontSize: 15 }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-[2] py-3 rounded-xl font-semibold text-white"
          style={{ background: '#E07B2F', fontSize: 15 }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
