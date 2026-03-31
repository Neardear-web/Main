'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  sessionId: string
  scheduledDate: string       // ISO string
  scheduledTime: string | null
  amountPaid: number          // rupees
  isPaid: boolean             // false = no payment captured yet
}

type Window = 'BEFORE_PAYMENT' | 'HOURS_48_PLUS' | 'HOURS_24_TO_48' | 'HOURS_UNDER_24' | 'SAME_DAY' | 'POST_SESSION'

function computeWindowClient(scheduledDate: string, scheduledTime: string | null): Window {
  const now = new Date()
  const sessionDt = new Date(scheduledDate)

  if (scheduledTime) {
    const [h, m] = scheduledTime.split(':').map(Number)
    sessionDt.setHours(h ?? 0, m ?? 0, 0, 0)
  } else {
    sessionDt.setHours(0, 0, 0, 0)
  }

  const hoursBeforeSession = (sessionDt.getTime() - now.getTime()) / (1000 * 60 * 60)

  const isSameCalendarDay =
    sessionDt.getFullYear() === now.getFullYear() &&
    sessionDt.getMonth() === now.getMonth() &&
    sessionDt.getDate() === now.getDate()

  if (hoursBeforeSession <= 0) return 'POST_SESSION'
  if (hoursBeforeSession > 48) return 'HOURS_48_PLUS'
  if (hoursBeforeSession > 24) return 'HOURS_24_TO_48'
  if (isSameCalendarDay) return 'SAME_DAY'
  return 'HOURS_UNDER_24'
}

function getRefundInfo(window: Window, amountPaid: number, isPaid: boolean): {
  refundAmount: number
  label: string
  sublabel: string
  severity: 'safe' | 'warn' | 'danger'
} {
  if (!isPaid) {
    return {
      refundAmount: 0,
      label: 'No charge',
      sublabel: 'Payment was not collected — session will be cancelled at no cost.',
      severity: 'safe',
    }
  }

  switch (window) {
    case 'HOURS_48_PLUS':
    case 'HOURS_24_TO_48':
      return {
        refundAmount: amountPaid,
        label: `Full refund — ₹${amountPaid.toLocaleString('en-IN')}`,
        sublabel: 'You cancelled more than 24 hours before the session. Full refund within 5–7 business days.',
        severity: 'safe',
      }
    case 'HOURS_UNDER_24':
      return {
        refundAmount: Math.round(amountPaid * 0.5),
        label: `50% refund — ₹${Math.round(amountPaid * 0.5).toLocaleString('en-IN')}`,
        sublabel: `Cancelling less than 24h before the session. ₹${Math.round(amountPaid * 0.5).toLocaleString('en-IN')} goes to your companion as compensation.`,
        severity: 'warn',
      }
    case 'SAME_DAY':
      return {
        refundAmount: 0,
        label: 'No refund',
        sublabel: 'Same-day cancellations are non-refundable. Your companion has already prepared for the visit.',
        severity: 'danger',
      }
    case 'POST_SESSION':
      return {
        refundAmount: 0,
        label: 'Session in progress',
        sublabel: 'The session has already started. Please contact support if you have a concern.',
        severity: 'danger',
      }
    default:
      return { refundAmount: 0, label: 'No refund', sublabel: '', severity: 'danger' }
  }
}

const REASONS = [
  'Change of plans',
  'Family emergency',
  'Elder condition changed',
  'Found alternative support',
  'Session date/time not suitable',
  'Other',
]

export default function CancelSessionModal({ sessionId, scheduledDate, scheduledTime, amountPaid, isPaid }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [resultMessage, setResultMessage] = useState('')

  const window = isPaid ? computeWindowClient(scheduledDate, scheduledTime) : 'BEFORE_PAYMENT'
  const refundInfo = getRefundInfo(window, amountPaid, isPaid)

  const canCancel = window !== 'POST_SESSION'

  const severityStyles = {
    safe: { bg: '#F0FAF4', border: '#4A8C6F', text: '#166534' },
    warn: { bg: '#FFFBEB', border: '#F0B429', text: '#92400E' },
    danger: { bg: '#FEF2F2', border: '#E85D4A', text: '#991B1B' },
  }
  const style = severityStyles[refundInfo.severity]

  async function handleConfirm() {
    if (!reason) {
      setError('Please select a reason for cancellation.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/sessions/${sessionId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelReason: reason }),
      })

      const data = await res.json() as { message?: string; error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Cancellation failed. Please try again.')
        return
      }

      setResultMessage(data.message ?? 'Session cancelled.')
      setDone(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          disabled
          className="w-full py-3 rounded-2xl text-sm font-medium border"
          style={{ borderColor: '#E8E0D8', color: '#9CA3AF', background: 'white', cursor: 'default' }}
        >
          Session Cancelled
        </button>

        {open && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 50, padding: 24,
            }}
          >
            <div style={{ background: 'white', borderRadius: 20, padding: 28, maxWidth: 440, width: '100%' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#4A8C6F', marginBottom: 8 }}>Session cancelled</p>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>{resultMessage}</p>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  width: '100%', padding: '12px 0', background: '#1C2B3A',
                  color: 'white', borderRadius: 12, fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer',
                }}
              >
                Go to dashboard
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-2xl text-sm font-medium border"
        style={{ borderColor: '#E8E0D8', color: '#6B7280', background: 'white' }}
      >
        Cancel session
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: 24,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={{ background: 'white', borderRadius: 20, padding: 28, maxWidth: 440, width: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1C2B3A', margin: 0 }}>
                  Cancel this session?
                </p>
                <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>This action cannot be undone.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ color: '#9CA3AF', fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Refund info box */}
            <div
              style={{
                background: style.bg,
                border: `1.5px solid ${style.border}`,
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 20,
              }}
            >
              <p style={{ fontWeight: 600, fontSize: 14, color: style.text, margin: 0 }}>{refundInfo.label}</p>
              <p style={{ fontSize: 13, color: style.text, marginTop: 4, opacity: 0.85, lineHeight: 1.5 }}>
                {refundInfo.sublabel}
              </p>
            </div>

            {canCancel ? (
              <>
                {/* Reason selector */}
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Reason for cancellation
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                  {REASONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setReason(r)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: `1.5px solid ${reason === r ? '#1C2B3A' : '#E8E0D8'}`,
                        background: reason === r ? '#F8F4EE' : 'white',
                        fontSize: 14,
                        color: reason === r ? '#1C2B3A' : '#374151',
                        fontWeight: reason === r ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {error && (
                  <p style={{ fontSize: 13, color: '#E85D4A', marginBottom: 12 }}>{error}</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    style={{
                      width: '100%', padding: '13px 0',
                      background: loading ? '#9CA3AF' : '#E85D4A',
                      color: 'white', borderRadius: 12,
                      fontWeight: 600, fontSize: 15, border: 'none', cursor: loading ? 'default' : 'pointer',
                    }}
                  >
                    {loading ? 'Cancelling…' : 'Confirm cancellation'}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    style={{
                      width: '100%', padding: '13px 0',
                      background: 'white', color: '#6B7280',
                      border: '1px solid #E8E0D8', borderRadius: 12,
                      fontWeight: 500, fontSize: 15, cursor: 'pointer',
                    }}
                  >
                    Keep session
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a
                  href="mailto:support@neardear.in"
                  style={{
                    display: 'block', textAlign: 'center', padding: '13px 0',
                    background: '#1C2B3A', color: 'white', borderRadius: 12,
                    fontWeight: 600, fontSize: 15, textDecoration: 'none',
                  }}
                >
                  Contact support
                </a>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: '100%', padding: '13px 0',
                    background: 'white', color: '#6B7280',
                    border: '1px solid #E8E0D8', borderRadius: 12,
                    fontWeight: 500, fontSize: 15, cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
