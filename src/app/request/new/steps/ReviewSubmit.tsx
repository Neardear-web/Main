'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FlowData } from '../types'

interface Props {
  flowData: FlowData
  onBack: () => void
  goToStep: (step: 'WHO' | 'ELDER_PROFILE' | 'WHAT_NEEDED' | 'WHEN') => void
}

const GENDER_LABELS: Record<string, string> = {
  FEMALE: 'Female preferred',
  MALE: 'Male preferred',
  NO_PREFERENCE: 'No preference',
}

function timingLabel(flowData: FlowData): string {
  if (!flowData.timingType) return '—'
  if (flowData.timingType === 'THIS_WEEK') return 'Sometime this week'
  if (flowData.timingType === 'SPECIFIC_DATE') {
    const parts = []
    if (flowData.preferredDate) parts.push(flowData.preferredDate)
    if (flowData.preferredTimeSlot) parts.push(flowData.preferredTimeSlot)
    return parts.length > 0 ? parts.join(' · ') : 'Specific date'
  }
  if (flowData.timingType === 'RECURRING') {
    const freq =
      flowData.recurringFreq === 'BIWEEKLY'
        ? 'Fortnightly'
        : flowData.recurringFreq === 'MONTHLY'
          ? 'Monthly'
          : 'Weekly'
    const days =
      flowData.recurringDays.length > 0
        ? ' · ' + flowData.recurringDays.join(', ')
        : ''
    return `Recurring — ${freq}${days}`
  }
  return '—'
}

const DIVIDER = (
  <div
    style={{ height: 1, background: '#E8E0D8', margin: '0 -24px' }}
  />
)

export default function ReviewSubmit({ flowData, onBack, goToStep }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const body = {
        elderName: flowData.elderName,
        elderCity: flowData.elderCity,
        elderPhone: flowData.elderPhone || undefined,
        elderAgeRange: flowData.elderAgeRange,
        elderPrimaryLanguage: flowData.elderPrimaryLanguage,
        elderHealthNotes: flowData.elderHealthNotes || undefined,
        emergencyContactName: flowData.emergencyContactName,
        emergencyContactPhone: flowData.emergencyContactPhone,
        genderPreference: flowData.genderPreference,
        descriptionRaw: flowData.descriptionRaw,
        selectedServiceIds: flowData.selectedServiceIds,
        notSureSelected: flowData.notSureSelected,
        timingType: flowData.timingType!,
        preferredDate: flowData.preferredDate || undefined,
        preferredTimeSlot: flowData.preferredTimeSlot || undefined,
        isRecurring: flowData.isRecurring,
        recurringFreq: flowData.recurringFreq ?? null,
        whoNeedsHelp: flowData.whoNeedsHelp!,
      }

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = (await res.json()) as { requestId?: string; error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      if (data.requestId) {
        router.push(`/request/${data.requestId}/matches`)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <h2
        className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-2"
        style={{ fontSize: 28 }}
      >
        Review your request
      </h2>
      <p className="text-[#6B7280] text-sm mb-6">
        Everything looks right? We will find you the right companion.
      </p>

      <div
        className="rounded-2xl shadow-sm overflow-hidden mb-6"
        style={{ background: '#FFFFFF', border: '1px solid #E8E0D8' }}
      >
        {/* Who needs help */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: '#1A6B7A' }}
              >
                Who needs help
              </p>
              <p className="text-[#1C2B3A] font-medium">
                {flowData.elderName || '—'}
                {flowData.elderCity ? ` in ${flowData.elderCity}` : ''}
              </p>
              {flowData.elderAgeRange && (
                <p className="text-sm text-[#6B7280] mt-0.5">
                  {flowData.elderAgeRange} · {flowData.elderPrimaryLanguage}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => goToStep('ELDER_PROFILE')}
              className="text-sm font-semibold shrink-0 ml-4"
              style={{ color: '#E07B2F' }}
            >
              Edit
            </button>
          </div>
        </div>

        {DIVIDER}

        {/* What you need */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: '#1A6B7A' }}
              >
                What you need
              </p>
              {flowData.descriptionRaw.trim() && (
                <p className="text-sm text-[#6B7280] italic mb-2">
                  &ldquo;{flowData.descriptionRaw.trim()}&rdquo;
                </p>
              )}
              {flowData.notSureSelected && (
                <p className="text-sm text-[#6B7280] italic mb-2">
                  Not sure — need help figuring it out
                </p>
              )}
              {flowData.selectedServiceIds.length === 0 &&
                !flowData.descriptionRaw.trim() &&
                !flowData.notSureSelected && (
                  <p className="text-sm text-[#9CA3AF]">Not specified</p>
                )}
            </div>
            <button
              type="button"
              onClick={() => goToStep('WHAT_NEEDED')}
              className="text-sm font-semibold shrink-0"
              style={{ color: '#E07B2F' }}
            >
              Edit
            </button>
          </div>
        </div>

        {DIVIDER}

        {/* When */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: '#1A6B7A' }}
              >
                When
              </p>
              <p className="text-[#1C2B3A]">{timingLabel(flowData)}</p>
            </div>
            <button
              type="button"
              onClick={() => goToStep('WHEN')}
              className="text-sm font-semibold shrink-0 ml-4"
              style={{ color: '#E07B2F' }}
            >
              Edit
            </button>
          </div>
        </div>

        {DIVIDER}

        {/* Preferences */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: '#1A6B7A' }}
              >
                Preferences
              </p>
              <p className="text-[#1C2B3A]">
                {GENDER_LABELS[flowData.genderPreference] ?? 'No preference'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep('ELDER_PROFILE')}
              className="text-sm font-semibold shrink-0 ml-4"
              style={{ color: '#E07B2F' }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm mb-4" style={{ color: '#E85D4A' }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
        style={{
          background: '#E07B2F',
          fontSize: 17,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? (
          <>
            <span
              className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
            />
            Finding matches...
          </>
        ) : (
          'Find a Companion →'
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full mt-3 py-3 rounded-xl border font-semibold text-[#1C2B3A] hover:bg-[#E8E0D8] transition-colors"
        style={{ borderColor: '#E8E0D8', fontSize: 15 }}
      >
        Back
      </button>
    </div>
  )
}
