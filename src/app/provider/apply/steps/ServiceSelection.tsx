'use client'

import { useState, useEffect } from 'react'
import type { ApplicationData, ServiceSelection as ServiceSelectionType } from '../types'

interface Props {
  data: ApplicationData
  setData: (update: Partial<ApplicationData>) => void
  onNext: () => void
  onBack: () => void
}

interface ServiceCategory {
  id: string
  name: string
  slug: string
  cluster: string
  descriptionProvider?: string
  descriptionReceiver: string
  suggestedFeeMin: number
  suggestedFeeMax: number
  minTrustLevel: string
}

const CLUSTER_LABELS: Record<string, string> = {
  PRESENCE: 'Presence & Companionship',
  NAVIGATION: 'Navigation & Errands',
  CONTINUITY: 'Continuity & Logistics',
  CONNECTION: 'Connection & Support',
  PROFESSIONAL_ADVISORY: 'Professional Advisory',
}

const EXPERIENCE_OPTIONS: { value: ServiceSelectionType['experienceLevel']; label: string; sub: string }[] = [
  { value: 'FIRST_TIME', label: 'First time', sub: 'I have not done this before but I am willing to learn' },
  { value: 'SOME_EXPERIENCE', label: 'Some experience', sub: 'I have done something similar a few times' },
  { value: 'CONFIDENT', label: 'Confident', sub: 'I have done this many times and feel comfortable' },
]

const TRUST_LEVEL_LABELS: Record<string, string> = {
  LEVEL_0: '0',
  LEVEL_1: '1',
  LEVEL_2: '2',
  LEVEL_3: '3',
}

export default function ServiceSelection({ data, setData, onNext }: Props) {
  const [services, setServices] = useState<ServiceCategory[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((d: ServiceCategory[]) => setServices(d))
      .catch(() => setServices([]))
  }, [])

  function isSelected(serviceId: string): boolean {
    return data.selectedServices.some((s) => s.serviceCategoryId === serviceId)
  }

  function getSelection(serviceId: string): ServiceSelectionType | undefined {
    return data.selectedServices.find((s) => s.serviceCategoryId === serviceId)
  }

  function toggleService(serviceId: string) {
    if (isSelected(serviceId)) {
      setData({
        selectedServices: data.selectedServices.filter((s) => s.serviceCategoryId !== serviceId),
      })
    } else {
      setData({
        selectedServices: [
          ...data.selectedServices,
          { serviceCategoryId: serviceId, experienceLevel: 'FIRST_TIME', personalStatement: '' },
        ],
      })
    }
    setError('')
  }

  function updateSelection(serviceId: string, update: Partial<ServiceSelectionType>) {
    setData({
      selectedServices: data.selectedServices.map((s) =>
        s.serviceCategoryId === serviceId ? { ...s, ...update } : s
      ),
    })
  }

  function handleNext() {
    if (data.selectedServices.length === 0) {
      setError('Please select at least one service you can genuinely offer')
      return
    }
    onNext()
  }

  // Group by cluster
  const grouped = services.reduce<Record<string, ServiceCategory[]>>((acc, svc) => {
    const key = svc.cluster
    if (!acc[key]) acc[key] = []
    acc[key].push(svc)
    return acc
  }, {})

  const clusterOrder = ['PRESENCE', 'NAVIGATION', 'CONTINUITY', 'CONNECTION', 'PROFESSIONAL_ADVISORY']

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A6B7A] mb-1">
          Which services can you genuinely offer?
        </h2>
        <p className="text-sm text-[#6B7280]">
          Select only what you can truly provide. It is better to offer fewer services well than many services poorly.
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl p-3 text-sm text-[#E85D4A]"
          style={{ background: '#FFF5F4', border: '1px solid #E85D4A' }}
        >
          {error}
        </div>
      )}

      {clusterOrder.map((clusterKey) => {
        const clusterServices = grouped[clusterKey]
        if (!clusterServices?.length) return null
        return (
          <div key={clusterKey} className="space-y-3">
            <h3 className="text-xs font-semibold text-[#1A6B7A] uppercase tracking-widest px-1">
              {CLUSTER_LABELS[clusterKey] ?? clusterKey}
            </h3>
            <div className="space-y-3">
              {clusterServices.map((svc) => {
                const selected = isSelected(svc.id)
                const sel = getSelection(svc.id)
                return (
                  <div
                    key={svc.id}
                    className="bg-white rounded-xl overflow-hidden transition-all"
                    style={{
                      border: selected ? '2px solid #4A8C6F' : '1.5px solid #E8E0D8',
                    }}
                  >
                    {/* Card header */}
                    <button
                      type="button"
                      onClick={() => toggleService(svc.id)}
                      className="w-full text-left p-4 flex items-start gap-3"
                    >
                      {/* Checkbox */}
                      <div
                        className="mt-0.5 flex-shrink-0 rounded flex items-center justify-center"
                        style={{
                          width: 20, height: 20,
                          background: selected ? '#4A8C6F' : '#FFFFFF',
                          border: selected ? '2px solid #4A8C6F' : '2px solid #E8E0D8',
                        }}
                      >
                        {selected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-[#1C2B3A]">{svc.name}</p>
                          <span
                            className="flex-shrink-0 text-xs font-[family-name:var(--font-dm-mono)] px-2 py-0.5 rounded-full"
                            style={{ background: '#FEF8F0', color: '#E07B2F', border: '1px solid #E07B2F' }}
                          >
                            ₹{svc.suggestedFeeMin}–{svc.suggestedFeeMax}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">{svc.descriptionProvider ?? svc.descriptionReceiver}</p>
                        <span
                          className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: '#EBF4F6', color: '#1A6B7A' }}
                        >
                          Min Trust Level: {TRUST_LEVEL_LABELS[svc.minTrustLevel] ?? svc.minTrustLevel}
                        </span>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {selected && sel && (
                      <div className="px-4 pb-4 space-y-3 border-t border-[#E8E0D8] pt-3">
                        <div>
                          <p className="text-xs font-semibold text-[#1C2B3A] mb-2">Your experience level</p>
                          <div className="space-y-2">
                            {EXPERIENCE_OPTIONS.map((opt) => {
                              const active = sel.experienceLevel === opt.value
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => updateSelection(svc.id, { experienceLevel: opt.value })}
                                  className="w-full text-left rounded-xl px-3 py-2 transition-all"
                                  style={{
                                    border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                                    background: active ? '#F0F7F4' : '#FAFAF9',
                                  }}
                                >
                                  <p className="text-xs font-semibold text-[#1C2B3A]">{opt.label}</p>
                                  <p className="text-xs text-[#6B7280]">{opt.sub}</p>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#1C2B3A] mb-1">
                            Why can you offer this? <span className="text-[#9CA3AF] font-normal">(optional but encouraged)</span>
                          </label>
                          <textarea
                            value={sel.personalStatement}
                            onChange={(e) => updateSelection(svc.id, { personalStatement: e.target.value })}
                            placeholder="Tell us about your relevant experience or motivation..."
                            rows={2}
                            className="w-full rounded-xl px-3 py-2 text-[#1C2B3A] text-xs outline-none focus:ring-2 focus:ring-[#4A8C6F] resize-none"
                            style={{ border: '1.5px solid #E8E0D8' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {services.length === 0 && (
        <div className="text-center py-8 text-[#9CA3AF] text-sm">Loading services...</div>
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
