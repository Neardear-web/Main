interface Props {
  compact?: boolean
}

export default function HealthcareDisclaimer({ compact = false }: Props) {
  if (compact) {
    return (
      <p className="text-xs" style={{ color: '#6B7280' }}>
        NearDear companions assist with daily care tasks as directed by the family and treating doctor.
        They are not registered medical professionals acting in a clinical capacity.{' '}
        <strong style={{ color: '#E85D4A' }}>Medical emergency? Call 112 immediately.</strong>
      </p>
    )
  }

  return (
    <div
      className="rounded-xl px-4 py-4 text-sm"
      style={{ background: '#FEF3CD', border: '1px solid #F59E0B' }}
    >
      <p className="font-semibold mb-1" style={{ color: '#92400E' }}>
        Important — please read
      </p>
      <p style={{ color: '#78350F' }}>
        NearDear companions providing personal care services are not registered medical professionals
        acting in a clinical capacity. They are trained, verified individuals who assist with daily
        care tasks as directed by the family and treating doctor.
      </p>
      <p className="mt-2" style={{ color: '#78350F' }}>
        For medical decisions, diagnosis, or treatment — always consult a qualified doctor.
      </p>
      <p className="mt-2 font-semibold" style={{ color: '#E85D4A' }}>
        In any medical emergency: call 112 immediately.
      </p>
    </div>
  )
}
