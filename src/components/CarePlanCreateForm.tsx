'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { calculatePlan, DISCOUNT_MATRIX, UPFRONT_EXTRA_DISCOUNT } from '@/lib/carePlan'

const FREQUENCY_OPTIONS = [
  { value: 'ONCE_WEEKLY',    label: 'Once a week' },
  { value: 'TWICE_WEEKLY',   label: 'Twice a week' },
  { value: 'THREE_WEEKLY',   label: 'Three times a week' },
  { value: 'DAILY_WEEKDAYS', label: 'Daily (Mon–Fri)' },
]

const DURATION_OPTIONS = [
  { value: 'ONE_MONTH',    label: '1 month' },
  { value: 'THREE_MONTHS', label: '3 months' },
  { value: 'SIX_MONTHS',  label: '6 months' },
]

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DAY_ABBR: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
}

const REQUIRED_DAYS: Record<string, number> = {
  ONCE_WEEKLY: 1,
  TWICE_WEEKLY: 2,
  THREE_WEEKLY: 3,
  DAILY_WEEKDAYS: 5,
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const TIME_OPTIONS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
]

function fmt(n: number) {
  return n.toLocaleString('en-IN')
}

export default function CarePlanCreateForm() {
  const params = useSearchParams()
  const router = useRouter()

  const serviceId      = params.get('serviceId') ?? ''
  const serviceName    = params.get('serviceName') ?? 'Elder Support Visit'
  const companionId    = params.get('companionId') ?? ''
  const companionName  = params.get('companionName') ?? ''
  const pricePerVisit  = parseInt(params.get('pricePerVisit') ?? '700', 10)
  const elderProfileId = params.get('elderProfileId') ?? undefined

  const [frequency, setFrequency] = useState('TWICE_WEEKLY')
  const [duration, setDuration]   = useState('THREE_MONTHS')
  const [billing, setBilling]     = useState('MONTHLY')
  const [days, setDays]           = useState<string[]>([])
  const [time, setTime]           = useState('10:00')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const calc = calculatePlan(pricePerVisit, frequency, duration, billing)

  function toggleDay(day: string) {
    if (frequency === 'DAILY_WEEKDAYS') return
    const required = REQUIRED_DAYS[frequency] ?? 1
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day))
    } else if (days.length < required) {
      setDays([...days, day])
    }
  }

  function effectiveDays(): string[] {
    if (frequency === 'DAILY_WEEKDAYS') return WEEKDAYS
    return days
  }

  const canSubmit = useCallback(() => {
    if (frequency === 'DAILY_WEEKDAYS') return true
    const required = REQUIRED_DAYS[frequency] ?? 1
    return days.length === required
  }, [frequency, days])

  async function handleSubmit() {
    if (!canSubmit()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/care-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerProfileId: companionId,
          serviceCategoryId: serviceId,
          elderProfileId: elderProfileId || undefined,
          frequency,
          duration,
          billing,
          preferredDays: effectiveDays(),
          preferredTime: time,
        }),
      })
      const data = await res.json() as { success?: boolean; planId?: string; error?: string }
      if (res.ok && data.planId) {
        router.push(`/dashboard?plan=${data.planId}`)
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const requiredDays = REQUIRED_DAYS[frequency] ?? 1
  const selectedDays = frequency === 'DAILY_WEEKDAYS' ? WEEKDAYS : days

  return (
    <div style={{ minHeight: '100vh', background: '#FEF8F0', padding: '32px 16px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Header */}
        <h1 style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontWeight: 700, fontSize: 26, color: '#1C2B3A',
          marginBottom: 4, lineHeight: 1.3,
        }}>
          Create a care plan
        </h1>
        <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>
          Lock in regular visits at a lower rate.
        </p>

        {/* Service + companion summary */}
        <div style={{
          background: '#FFFFFF', borderRadius: 16,
          border: '1px solid #E8E0D8', padding: 16, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: '#4A8C6F',
              color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>
              {companionName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, color: '#1C2B3A', margin: 0 }}>
                {companionName}
              </p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{serviceName}</p>
            </div>
            <span style={{
              marginLeft: 'auto', background: '#F0FAF4', color: '#4A8C6F',
              borderRadius: 9999, padding: '2px 10px', fontSize: 12, fontWeight: 600,
            }}>
              Same companion ✓
            </span>
          </div>
        </div>

        {/* Frequency */}
        <Section label="How often?">
          {FREQUENCY_OPTIONS.map((opt) => {
            const disc = DISCOUNT_MATRIX[duration]?.[opt.value] ?? 0
            return (
              <RadioRow
                key={opt.value}
                label={opt.label}
                badge={disc > 0 ? `${disc}% off` : undefined}
                selected={frequency === opt.value}
                onClick={() => {
                  setFrequency(opt.value)
                  setDays([])
                }}
              />
            )
          })}
        </Section>

        {/* Duration */}
        <Section label="For how long?">
          {DURATION_OPTIONS.map((opt) => {
            const disc = DISCOUNT_MATRIX[opt.value]?.[frequency] ?? 0
            return (
              <RadioRow
                key={opt.value}
                label={opt.label}
                badge={disc > 0 ? `${disc}% off` : undefined}
                selected={duration === opt.value}
                onClick={() => setDuration(opt.value)}
              />
            )
          })}
        </Section>

        {/* Plan summary */}
        <div style={{
          background: '#FFFFFF', borderRadius: 16,
          border: '1px solid #E8E0D8', padding: 20, marginBottom: 20,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#1A6B7A', marginBottom: 12,
          }}>
            Your plan summary
          </p>
          <SummaryRow label={`${calc.totalSessions} visits`} value={`over ${DURATION_OPTIONS.find(d => d.value === duration)?.label}`} />
          <SummaryRow label="Regular price" value={`₹${fmt(calc.totalRegularPrice)}`} muted />
          <SummaryRow
            label={`Plan price (${calc.totalDiscountPercent}% off)`}
            value={`₹${fmt(calc.totalPlanPrice)}`}
            highlight
          />
          <div style={{ borderTop: '1px solid #E8E0D8', marginTop: 12, paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#4A8C6F' }}>You save</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#4A8C6F' }}>
                ₹{fmt(calc.totalSavings)} ({calc.totalDiscountPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Billing */}
        <Section label="Charged as:">
          <RadioRow
            label="Monthly"
            sublabel={calc.monthlyAmount ? `₹${fmt(calc.monthlyAmount)}/month` : undefined}
            selected={billing === 'MONTHLY'}
            onClick={() => setBilling('MONTHLY')}
          />
          <RadioRow
            label="Full upfront"
            sublabel={`₹${fmt(calc.totalPlanPrice)} total`}
            badge={`Extra ${UPFRONT_EXTRA_DISCOUNT}% off`}
            selected={billing === 'UPFRONT'}
            onClick={() => setBilling('UPFRONT')}
          />
        </Section>

        {/* Preferred days */}
        <Section label={
          frequency === 'DAILY_WEEKDAYS'
            ? 'Days (Monday – Friday)'
            : `Preferred days (pick ${requiredDays})`
        }>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ALL_DAYS.map((day) => {
              const isWeekend = day === 'Saturday' || day === 'Sunday'
              const locked = frequency === 'DAILY_WEEKDAYS'
              const active = locked ? !isWeekend : days.includes(day)
              const disabled = locked || (isWeekend && frequency === 'DAILY_WEEKDAYS')
              return (
                <button
                  key={day}
                  onClick={() => !disabled && !locked && toggleDay(day)}
                  style={{
                    padding: '6px 12px', borderRadius: 9999, fontSize: 13, fontWeight: 600,
                    border: `1.5px solid ${active ? '#E07B2F' : '#E8E0D8'}`,
                    background: active ? '#E07B2F' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#6B7280',
                    cursor: locked || disabled ? 'default' : 'pointer',
                    opacity: isWeekend && frequency === 'DAILY_WEEKDAYS' ? 0.4 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {DAY_ABBR[day]}
                </button>
              )
            })}
          </div>
          {frequency !== 'DAILY_WEEKDAYS' && days.length < requiredDays && (
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
              Select {requiredDays - days.length} more day{requiredDays - days.length !== 1 ? 's' : ''}
            </p>
          )}
        </Section>

        {/* Preferred time */}
        <Section label="Preferred time">
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              border: '1.5px solid #E8E0D8', fontSize: 14, color: '#1C2B3A',
              background: '#FFFFFF', cursor: 'pointer',
            }}
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Section>

        {/* Days confirmation */}
        {selectedDays.length > 0 && (
          <div style={{
            background: '#F0FAF4', borderRadius: 12,
            border: '1px solid #4A8C6F33', padding: '12px 16px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, color: '#4A8C6F', margin: 0, fontWeight: 500 }}>
              {selectedDays.join(', ')} at {time}
            </p>
          </div>
        )}

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            color: '#E85D4A', fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          <button
            onClick={handleSubmit}
            disabled={submitting || !canSubmit()}
            style={{
              background: submitting || !canSubmit() ? '#C4600A' : '#E07B2F',
              color: '#FFFFFF', borderRadius: 12, padding: '14px 0',
              fontWeight: 600, fontSize: 16, border: 'none',
              cursor: submitting || !canSubmit() ? 'not-allowed' : 'pointer',
              opacity: !canSubmit() ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {submitting
              ? 'Creating plan…'
              : `Create care plan — save ₹${fmt(calc.totalSavings)}`}
          </button>
          <button
            onClick={() => router.back()}
            style={{
              background: 'transparent', color: '#6B7280', border: 'none',
              fontSize: 14, cursor: 'pointer', padding: '10px 0',
            }}
          >
            Continue without a plan
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#1C2B3A', marginBottom: 10 }}>
        {label}
      </p>
      <div style={{
        background: '#FFFFFF', borderRadius: 16,
        border: '1px solid #E8E0D8', overflow: 'hidden',
        padding: 12, display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {children}
      </div>
    </div>
  )
}

function RadioRow({
  label, sublabel, badge, selected, onClick,
}: {
  label: string
  sublabel?: string
  badge?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10, border: 'none',
        background: selected ? '#FFF7F0' : 'transparent',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        outline: selected ? '1.5px solid #E07B2F' : '1px solid transparent',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Radio indicator */}
      <div style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? '#E07B2F' : '#D1D5DB'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E07B2F' }} />
        )}
      </div>
      {/* Label */}
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#1C2B3A' }}>{label}</span>
        {sublabel && (
          <span style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>{sublabel}</span>
        )}
      </div>
      {/* Badge */}
      {badge && (
        <span style={{
          background: '#F0FAF4', color: '#4A8C6F',
          borderRadius: 9999, padding: '2px 8px', fontSize: 12, fontWeight: 600,
        }}>
          {badge}
        </span>
      )}
    </button>
  )
}

function SummaryRow({
  label, value, muted, highlight,
}: {
  label: string
  value?: string
  muted?: boolean
  highlight?: boolean
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 8,
    }}>
      <span style={{ fontSize: 14, color: muted ? '#9CA3AF' : '#374151' }}>{label}</span>
      {value && (
        <span style={{
          fontSize: 14, fontWeight: highlight ? 700 : 500,
          color: highlight ? '#1C2B3A' : muted ? '#9CA3AF' : '#6B7280',
          fontFamily: 'DM Mono, monospace',
        }}>
          {value}
        </span>
      )}
    </div>
  )
}
