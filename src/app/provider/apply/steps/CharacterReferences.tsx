'use client'

import { useState } from 'react'
import type { ApplicationData, Reference } from '../types'

interface Props {
  data: ApplicationData
  setData: (update: Partial<ApplicationData>) => void
  onNext: () => void
  onBack: () => void
}

const YEARS_KNOWN_OPTIONS = [
  { value: '1_2y', label: '1–2 years' },
  { value: '2_5y', label: '2–5 years' },
  { value: '5y_plus', label: '5+ years' },
]

interface RefErrors {
  name?: string
  phone?: string
  relationship?: string
  yearsKnown?: string
}

interface FormErrors {
  ref1?: RefErrors
  ref2?: RefErrors
  cross?: string
}

function ReferenceCard({
  label,
  refData,
  onChange,
  errors,
}: {
  label: string
  refData: Reference
  onChange: (update: Partial<Reference>) => void
  errors?: RefErrors
}) {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-4" style={{ border: '1px solid #E8E0D8' }}>
      <h3 className="text-sm font-semibold text-[#1A6B7A]">{label}</h3>

      <div>
        <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
          Full name <span className="text-[#E85D4A]">*</span>
        </label>
        <input
          type="text"
          value={refData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Reference's full name"
          className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
          style={{ border: errors?.name ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
        />
        {errors?.name && <p className="text-xs text-[#E85D4A] mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
          Phone <span className="text-[#E85D4A]">*</span>
        </label>
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ border: errors?.phone ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
        >
          <span className="px-3 py-3 text-sm text-[#6B7280] bg-[#F9F5F0] border-r border-[#E8E0D8] font-[family-name:var(--font-dm-mono)]">+91</span>
          <input
            type="tel"
            value={refData.phone}
            onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            placeholder="10-digit mobile"
            maxLength={10}
            className="flex-1 px-4 py-3 text-[#1C2B3A] text-sm outline-none font-[family-name:var(--font-dm-mono)] bg-white"
          />
        </div>
        {errors?.phone && <p className="text-xs text-[#E85D4A] mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
          Relationship <span className="text-[#E85D4A]">*</span>
        </label>
        <input
          type="text"
          value={refData.relationship}
          onChange={(e) => onChange({ relationship: e.target.value })}
          placeholder="e.g. Neighbour, Former colleague, Community member, Friend"
          className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
          style={{ border: errors?.relationship ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
        />
        {errors?.relationship && <p className="text-xs text-[#E85D4A] mt-1">{errors.relationship}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
          How long have you known them? <span className="text-[#E85D4A]">*</span>
        </label>
        <select
          value={refData.yearsKnown}
          onChange={(e) => onChange({ yearsKnown: e.target.value })}
          className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F] bg-white"
          style={{ border: errors?.yearsKnown ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
        >
          <option value="">Select duration</option>
          {YEARS_KNOWN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errors?.yearsKnown && <p className="text-xs text-[#E85D4A] mt-1">{errors.yearsKnown}</p>}
      </div>
    </div>
  )
}

export default function CharacterReferences({ data, setData, onNext }: Props) {
  const [errors, setErrors] = useState<FormErrors>({})

  function validateRef(ref: Reference, label: string): RefErrors {
    const e: RefErrors = {}
    if (!ref.name.trim()) e.name = `${label} name is required`
    if (!ref.phone.trim() || !/^\d{10}$/.test(ref.phone)) e.phone = `${label} phone must be 10 digits`
    if (!ref.relationship.trim()) e.relationship = `${label} relationship is required`
    if (!ref.yearsKnown) e.yearsKnown = `Please select how long you have known ${label}`
    return e
  }

  function validate(): boolean {
    const e: FormErrors = {}
    const ref1Errors = validateRef(data.reference1, 'Reference 1')
    const ref2Errors = validateRef(data.reference2, 'Reference 2')
    if (Object.keys(ref1Errors).length) e.ref1 = ref1Errors
    if (Object.keys(ref2Errors).length) e.ref2 = ref2Errors

    if (data.reference1.phone && data.reference2.phone &&
      data.reference1.phone === data.reference2.phone) {
      e.cross = 'Reference 1 and Reference 2 cannot have the same phone number'
    }
    if (data.reference1.phone && data.reference1.phone === data.phone) {
      e.cross = 'A reference cannot have your own phone number'
    }
    if (data.reference2.phone && data.reference2.phone === data.phone) {
      e.cross = 'A reference cannot have your own phone number'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validate()) onNext()
  }

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A6B7A] mb-2">
          Character References
        </h2>
        <p className="text-sm text-[#6B7280]">
          We will call both references to ask a few questions about you. Please choose people who know you well — neighbours, community members, former colleagues. Not family members.
        </p>
      </div>

      <ReferenceCard
        label="Reference 1"
        refData={data.reference1}
        onChange={(update) => setData({ reference1: { ...data.reference1, ...update } })}
        errors={errors.ref1}
      />

      <ReferenceCard
        label="Reference 2"
        refData={data.reference2}
        onChange={(update) => setData({ reference2: { ...data.reference2, ...update } })}
        errors={errors.ref2}
      />

      {errors.cross && (
        <div
          className="rounded-xl p-3 text-sm text-[#E85D4A]"
          style={{ background: '#FFF5F4', border: '1px solid #E85D4A' }}
        >
          {errors.cross}
        </div>
      )}

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
