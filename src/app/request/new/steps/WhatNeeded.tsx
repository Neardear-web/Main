'use client'

import { useEffect, useState } from 'react'
import type { FlowData } from '../types'

interface ServiceItem {
  id: string
  name: string
  slug: string
  cluster: string
  mode: string
  descriptionReceiver: string
  suggestedFeeMin: number
  suggestedFeeMax: number
}

interface Props {
  flowData: FlowData
  setFlowData: (data: Partial<FlowData>) => void
  onNext: () => void
  onBack: () => void
}

const CLUSTER_LABELS: Record<string, string> = {
  PRESENCE: 'Presence & Companionship',
  NAVIGATION: 'Navigation & Errands',
  CONTINUITY: 'Continuity & Logistics',
  CONNECTION: 'Connection & Support',
  PROFESSIONAL_ADVISORY: 'Professional Advisory',
}

const CLUSTER_ORDER = ['PRESENCE', 'NAVIGATION', 'CONTINUITY', 'CONNECTION']

function wordCount(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

export default function WhatNeeded({
  flowData,
  setFlowData,
  onNext,
  onBack,
}: Props) {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [expandedClusters, setExpandedClusters] = useState<
    Record<string, boolean>
  >({})
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data: ServiceItem[]) => setServices(data))
      .catch(() => {})
  }, [])

  const grouped = CLUSTER_ORDER.reduce<Record<string, ServiceItem[]>>(
    (acc, cluster) => {
      acc[cluster] = services.filter((s) => s.cluster === cluster)
      return acc
    },
    {},
  )

  function toggleCluster(cluster: string) {
    setExpandedClusters((prev) => ({ ...prev, [cluster]: !prev[cluster] }))
  }

  function toggleService(id: string) {
    const current = flowData.selectedServiceIds
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id]
    setFlowData({ selectedServiceIds: next })
  }

  function handleNext() {
    const valid =
      flowData.descriptionRaw.trim().length > 0 ||
      flowData.selectedServiceIds.length > 0 ||
      flowData.notSureSelected
    if (!valid) {
      setError(
        'Please describe what you need, select a service, or choose "I am not sure".',
      )
      return
    }
    setError('')
    onNext()
  }

  const words = wordCount(flowData.descriptionRaw)

  return (
    <div>
      <h2
        className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-2"
        style={{ fontSize: 26 }}
      >
        What do you need?
      </h2>
      <p className="text-[#6B7280] text-sm mb-6">
        Describe in your own words or select from our services below.
      </p>

      {/* Free text */}
      <div
        className="rounded-2xl shadow-sm p-6 mb-4"
        style={{ background: '#FFFFFF' }}
      >
        <label className="block text-sm font-semibold text-[#1A6B7A] mb-1">
          Describe what you need in your own words
        </label>
        <p className="text-xs text-[#6B7280] mb-3">
          Our AI will match you with the right companion
        </p>
        <textarea
          rows={4}
          className="w-full rounded-lg border border-[#E8E0D8] px-3 py-2.5 text-[#1C2B3A] text-sm outline-none focus:border-[#1A6B7A] resize-none transition-colors"
          placeholder="For example: Someone to visit my mother twice a week in Ahmedabad and take her to her doctor appointments when needed. She speaks Gujarati and lives alone."
          value={flowData.descriptionRaw}
          onChange={(e) => setFlowData({ descriptionRaw: e.target.value })}
        />
        <p className="text-xs text-[#9CA3AF] mt-1 text-right">
          {words} {words === 1 ? 'word' : 'words'}
        </p>
      </div>

      {/* Service selection */}
      <div
        className="rounded-2xl shadow-sm p-6 mb-4"
        style={{ background: '#FFFFFF' }}
      >
        <p className="text-sm font-semibold text-[#1A6B7A] mb-1">
          Or select specific services
        </p>
        <p className="text-xs text-[#6B7280] mb-4">You can select multiple</p>

        <div className="flex flex-col gap-3">
          {CLUSTER_ORDER.map((cluster) => {
            const clusterServices = grouped[cluster] ?? []
            if (clusterServices.length === 0) return null
            const isExpanded = !!expandedClusters[cluster]
            const selectedInCluster = clusterServices.filter((s) =>
              flowData.selectedServiceIds.includes(s.id),
            ).length

            return (
              <div
                key={cluster}
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid #E8E0D8' }}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#FEF8F0] transition-colors"
                  onClick={() => toggleCluster(cluster)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1C2B3A]">
                      {CLUSTER_LABELS[cluster] ?? cluster}
                    </span>
                    {selectedInCluster > 0 && (
                      <span
                        className="text-xs font-semibold text-white rounded-full px-2 py-0.5"
                        style={{ background: '#E07B2F' }}
                      >
                        {selectedInCluster}
                      </span>
                    )}
                  </div>
                  <span className="text-[#9CA3AF] text-sm">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-[#E8E0D8]">
                    {clusterServices.map((svc) => {
                      const isChecked = flowData.selectedServiceIds.includes(
                        svc.id,
                      )
                      return (
                        <label
                          key={svc.id}
                          className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                          style={{
                            borderLeft: isChecked
                              ? '3px solid #E07B2F'
                              : '3px solid transparent',
                            background: isChecked ? '#FFF8F3' : 'white',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleService(svc.id)}
                            className="mt-1 accent-[#E07B2F]"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-[#1C2B3A]">
                                {svc.name}
                              </p>
                              <p
                                className="text-sm font-[family-name:var(--font-dm-mono)] shrink-0"
                                style={{ color: '#F0B429' }}
                              >
                                from ₹{svc.suggestedFeeMin.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              {svc.descriptionReceiver}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Not sure option */}
      <div
        className="rounded-2xl shadow-sm p-5 mb-4"
        style={{ background: '#FFFFFF', border: '1px solid #E8E0D8' }}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={flowData.notSureSelected}
            onChange={(e) =>
              setFlowData({ notSureSelected: e.target.checked })
            }
            className="mt-1 accent-[#E07B2F]"
          />
          <div>
            <p className="text-sm font-semibold text-[#1C2B3A]">
              I am not sure — help me figure out what I need
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              We will connect you with a trusted companion who will listen and
              suggest the right services.
            </p>
          </div>
        </label>
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
