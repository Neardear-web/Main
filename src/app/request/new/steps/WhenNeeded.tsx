'use client'

import { useState } from 'react'
import type { FlowData } from '../types'

interface Props {
  flowData: FlowData
  setFlowData: (data: Partial<FlowData>) => void
  onNext: () => void
  onBack: () => void
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const TIME_SLOTS = [
  { value: 'Morning', label: 'Morning (9am–12pm)' },
  { value: 'Afternoon', label: 'Afternoon (12pm–4pm)' },
  { value: 'Evening', label: 'Evening (4pm–7pm)' },
  { value: 'Flexible', label: 'Flexible' },
]

const TODAY = new Date().toISOString().split('T')[0]

type TimingType = 'SPECIFIC_DATE' | 'THIS_WEEK' | 'RECURRING'

const TIMING_OPTIONS: {
  value: TimingType
  label: string
  subtext: string
}[] = [
  {
    value: 'SPECIFIC_DATE',
    label: 'A specific date and time',
    subtext: 'I know exactly when I need help',
  },
  {
    value: 'THIS_WEEK',
    label: 'Sometime this week',
    subtext: 'Flexible scheduling within the week',
  },
  {
    value: 'RECURRING',
    label: 'Regular recurring visits',
    subtext: 'Ongoing scheduled support',
  },
]

export default function WhenNeeded({
  flowData,
  setFlowData,
  onNext,
  onBack,
}: Props) {
  const [error, setError] = useState('')

  function handleNext() {
    if (!flowData.timingType) {
      setError('Please select when you need help.')
      return
    }
    setError('')
    onNext()
  }

  function toggleDay(day: string) {
    const current = flowData.recurringDays
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day]
    setFlowData({ recurringDays: next })
  }

  return (
    <div>
      <h2
        className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-2"
        style={{ fontSize: 26 }}
      >
        When do you need this?
      </h2>
      <p className="text-[#6B7280] text-sm mb-6">
        Choose the timing that works best for you.
      </p>

      <div className="flex flex-col gap-3 mb-4">
        {TIMING_OPTIONS.map((opt) => {
          const isSelected = flowData.timingType === opt.value
          return (
            <div key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  setFlowData({
                    timingType: opt.value,
                    isRecurring: opt.value === 'RECURRING',
                  })
                }}
                className="w-full text-left rounded-xl p-5 transition-all"
                style={{
                  background: isSelected ? '#FFF8F3' : '#FFFFFF',
                  border: `2px solid ${isSelected ? '#E07B2F' : '#E8E0D8'}`,
                }}
              >
                <p className="text-sm font-semibold text-[#1C2B3A]">
                  {opt.label}
                </p>
                <p className="text-xs text-[#6B7280] mt-0.5">{opt.subtext}</p>
              </button>

              {/* SPECIFIC_DATE expanded */}
              {isSelected && opt.value === 'SPECIFIC_DATE' && (
                <div
                  className="rounded-xl p-5 mt-1 flex flex-col gap-4"
                  style={{ background: '#FFF8F3', border: '1px solid #E8E0D8' }}
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#1A6B7A] mb-1">
                      Preferred date
                    </label>
                    <input
                      type="date"
                      min={TODAY}
                      className="w-full rounded-lg border border-[#E8E0D8] px-3 py-2 text-sm text-[#1C2B3A] outline-none focus:border-[#1A6B7A] bg-white"
                      value={flowData.preferredDate}
                      onChange={(e) =>
                        setFlowData({ preferredDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A6B7A] mb-1">
                      Preferred time
                    </label>
                    <select
                      className="w-full rounded-lg border border-[#E8E0D8] px-3 py-2 text-sm text-[#1C2B3A] outline-none focus:border-[#1A6B7A] bg-white"
                      value={flowData.preferredTimeSlot}
                      onChange={(e) =>
                        setFlowData({ preferredTimeSlot: e.target.value })
                      }
                    >
                      <option value="">Select time slot</option>
                      {TIME_SLOTS.map((ts) => (
                        <option key={ts.value} value={ts.value}>
                          {ts.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* RECURRING expanded */}
              {isSelected && opt.value === 'RECURRING' && (
                <div
                  className="rounded-xl p-5 mt-1 flex flex-col gap-4"
                  style={{ background: '#FFF8F3', border: '1px solid #E8E0D8' }}
                >
                  {/* Frequency */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1A6B7A] mb-2">
                      Frequency
                    </label>
                    <div className="flex gap-3">
                      {(['WEEKLY', 'BIWEEKLY', 'MONTHLY'] as const).map(
                        (freq) => (
                          <label
                            key={freq}
                            className="flex items-center gap-1.5 cursor-pointer text-sm text-[#1C2B3A]"
                          >
                            <input
                              type="radio"
                              name="recurringFreq"
                              value={freq}
                              checked={flowData.recurringFreq === freq}
                              onChange={() => setFlowData({ recurringFreq: freq })}
                              className="accent-[#E07B2F]"
                            />
                            {freq === 'WEEKLY'
                              ? 'Weekly'
                              : freq === 'BIWEEKLY'
                                ? 'Fortnightly'
                                : 'Monthly'}
                          </label>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Preferred days */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1A6B7A] mb-2">
                      Preferred days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((day) => {
                        const isActive = flowData.recurringDays.includes(day)
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className="px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                            style={{
                              background: isActive ? '#E07B2F' : 'white',
                              color: isActive ? 'white' : '#1C2B3A',
                              border: `1px solid ${isActive ? '#E07B2F' : '#E8E0D8'}`,
                            }}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Preferred time */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1A6B7A] mb-1">
                      Preferred time
                    </label>
                    <select
                      className="w-full rounded-lg border border-[#E8E0D8] px-3 py-2 text-sm text-[#1C2B3A] outline-none focus:border-[#1A6B7A] bg-white"
                      value={flowData.preferredTimeSlot}
                      onChange={(e) =>
                        setFlowData({ preferredTimeSlot: e.target.value })
                      }
                    >
                      <option value="">Select time slot</option>
                      {TIME_SLOTS.map((ts) => (
                        <option key={ts.value} value={ts.value}>
                          {ts.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start date */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1A6B7A] mb-1">
                      Start date (optional)
                    </label>
                    <input
                      type="date"
                      min={TODAY}
                      className="w-full rounded-lg border border-[#E8E0D8] px-3 py-2 text-sm text-[#1C2B3A] outline-none focus:border-[#1A6B7A] bg-white"
                      value={flowData.preferredDate}
                      onChange={(e) =>
                        setFlowData({ preferredDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <p className="text-sm mb-4" style={{ color: '#E85D4A' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border font-semibold text-[#1C2B3A] hover:bg-[#E8E0D8] transition-colors"
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
