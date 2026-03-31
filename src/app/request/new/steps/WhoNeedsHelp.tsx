'use client'

import type { FlowData } from '../types'

interface Props {
  flowData: FlowData
  setFlowData: (data: Partial<FlowData>) => void
  onNext: () => void
}

const OPTIONS: {
  value: 'MYSELF' | 'PARENT' | 'SOMEONE_ELSE'
  label: string
  subtext: string
}[] = [
  {
    value: 'MYSELF',
    label: 'For myself',
    subtext: 'I need help directly',
  },
  {
    value: 'PARENT',
    label: 'For my parent / elder family member',
    subtext: 'Booking on behalf of someone in their city',
  },
  {
    value: 'SOMEONE_ELSE',
    label: 'For someone else I am responsible for',
    subtext: 'A relative, friend, or person in your care',
  },
]

export default function WhoNeedsHelp({ flowData, setFlowData, onNext }: Props) {
  const selected = flowData.whoNeedsHelp

  return (
    <div>
      <h2
        className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-2"
        style={{ fontSize: 28 }}
      >
        Who needs help?
      </h2>
      <p className="text-[#6B7280] text-sm mb-6">
        Tell us who you are booking this for.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFlowData({ whoNeedsHelp: opt.value })}
              className="w-full text-left rounded-xl p-5 cursor-pointer transition-all"
              style={{
                background: isSelected ? '#FFF8F3' : '#FFFFFF',
                border: `2px solid ${isSelected ? '#E07B2F' : '#E8E0D8'}`,
              }}
            >
              <p
                className="font-[family-name:var(--font-dm-sans)] font-semibold text-[#1C2B3A]"
                style={{ fontSize: 15 }}
              >
                {opt.label}
              </p>
              <p className="text-[#6B7280] text-sm mt-0.5">{opt.subtext}</p>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!selected}
        className="w-full py-4 rounded-xl font-[family-name:var(--font-dm-sans)] font-semibold text-white transition-opacity"
        style={{
          background: '#E07B2F',
          opacity: selected ? 1 : 0.4,
          cursor: selected ? 'pointer' : 'not-allowed',
          fontSize: 16,
        }}
      >
        Continue
      </button>
    </div>
  )
}
