import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCompanionRate } from '@/lib/earnings'
import Link from 'next/link'

const statusColor: Record<string, { bg: string; text: string }> = {
  PENDING:    { bg: '#F3F4F6', text: '#6B7280' },
  RELEASED:   { bg: '#EFF6FF', text: '#1A6B7A' },
  PROCESSING: { bg: '#FEF3C7', text: '#92400E' },
  PAID:       { bg: '#F0FAF4', text: '#166534' },
  HELD:       { bg: '#FEF2F2', text: '#991B1B' },
  CANCELLED:  { bg: '#F3F4F6', text: '#9CA3AF' },
}

const sourceLabel: Record<string, string> = {
  INDIVIDUAL: 'Custom rate set by NearDear team',
  CITY:       'City rate',
  GLOBAL:     'Standard platform rate',
}

export default async function ProviderEarningsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      earnings: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          session: { select: { scheduledDate: true, serviceCity: true } },
        },
      },
      rateConfigs: {
        where: {
          isActive: true,
          effectiveFrom: { lte: new Date() },
          OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date() } }],
        },
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
      bonusCredits: {
        where: { status: 'CREDITED' },
        orderBy: { creditedAt: 'desc' },
        take: 10,
      },
      performanceWarnings: {
        where: { resolvedAt: null },
        orderBy: { issuedAt: 'desc' },
      },
    },
  })

  if (!profile) redirect('/provider/apply')

  // Resolve city slug from display name
  const city = profile.city
    ? await prisma.city.findFirst({ where: { name: { equals: profile.city, mode: 'insensitive' } } })
    : null
  const citySlug = city?.slug ?? 'ahmedabad'

  const { companionPct, source } = await getCompanionRate(profile.id, citySlug, new Date())

  // Earnings summary
  const earned = profile.earnings
    .filter((e) => ['RELEASED', 'PROCESSING', 'PAID'].includes(e.status))
    .reduce((s, e) => s + e.amount, 0)

  const pending = profile.earnings
    .filter((e) => ['PENDING', 'RELEASED'].includes(e.status))
    .reduce((s, e) => s + e.amount, 0)

  const paid = profile.earnings
    .filter((e) => e.status === 'PAID')
    .reduce((s, e) => s + e.amount, 0)

  const bonusTotal = profile.bonusCredits.reduce((s, b) => s + b.amount, 0)

  const activeWarnings = profile.performanceWarnings
  const activeRate = profile.rateConfigs[0]

  const warningBannerStyle: Record<string, { bg: string; border: string; text: string }> = {
    YELLOW: { bg: '#FFFBEB', border: '#F0B429', text: '#92400E' },
    ORANGE: { bg: '#FFF7ED', border: '#E07B2F', text: '#7C2D12' },
    RED:    { bg: '#FEF2F2', border: '#E85D4A', text: '#991B1B' },
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FEF8F0', padding: '40px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link
            href="/"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, fontWeight: 700, color: '#E07B2F', textDecoration: 'none' }}
          >
            NearDear
          </Link>
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, fontSize: 26, color: '#1C2B3A', marginBottom: 8 }}>
          Your Earnings
        </h1>

        {/* Warning banners */}
        {activeWarnings.map((w) => {
          const s = warningBannerStyle[w.level] ?? warningBannerStyle['YELLOW']
          return (
            <div key={w.id} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12, padding: '12px 16px', marginBottom: 12 }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: s.text, margin: 0 }}>
                {w.level === 'YELLOW' && 'Your account has received a warning.'}
                {w.level === 'ORANGE' && 'Your account is under performance review.'}
                {w.level === 'RED' && 'An action has been taken on your account.'}
              </p>
              <p style={{ fontSize: 12, color: s.text, opacity: 0.85, marginTop: 4 }}>{w.reason}</p>
              {w.level === 'RED' && (
                <p style={{ fontSize: 12, color: s.text, marginTop: 4, opacity: 0.7 }}>
                  To appeal, email <a href="mailto:support@neardear.in" style={{ color: s.text }}>support@neardear.in</a>
                </p>
              )}
            </div>
          )
        })}

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total earned', value: earned, color: '#4A8C6F' },
            { label: 'Pending', value: pending, color: '#1A6B7A' },
            { label: 'Paid out', value: paid, color: '#1C2B3A' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0D8', padding: '16px 14px' }}>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>{label}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'monospace' }}>
                ₹{value.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>

        {/* Rate card */}
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0D8', padding: '20px 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#1A6B7A', marginBottom: 12 }}>
            Your earning rate
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: companionPct > 80 ? '#4A8C6F' : '#1C2B3A' }}>
              {companionPct}%
            </span>
            <div>
              <p style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>of each session fee</p>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{sourceLabel[source]}</p>
            </div>
          </div>
          {companionPct > 80 && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#F0FAF4', borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: '#166534', fontWeight: 500 }}>
                You&apos;re on a premium earning rate — keep up your great work!
              </p>
              {activeRate?.notificationNote && (
                <p style={{ fontSize: 12, color: '#166534', opacity: 0.8, marginTop: 4 }}>
                  &ldquo;{activeRate.notificationNote}&rdquo;
                </p>
              )}
            </div>
          )}
          {companionPct < 80 && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: '#991B1B', fontWeight: 500 }}>
                Your rate has been adjusted. Contact support to understand why.
              </p>
            </div>
          )}
        </div>

        {/* Bonus credits */}
        {profile.bonusCredits.length > 0 && (
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0D8', padding: '20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#E07B2F' }}>
                Bonus Credits
              </p>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#E07B2F', fontFamily: 'monospace' }}>
                +₹{bonusTotal.toLocaleString('en-IN')}
              </span>
            </div>
            {profile.bonusCredits.map((b) => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #F3F4F6' }}>
                <p style={{ fontSize: 13, color: '#374151' }}>{b.reason}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#E07B2F', fontFamily: 'monospace' }}>+₹{b.amount}</span>
              </div>
            ))}
          </div>
        )}

        {/* Earnings table */}
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0D8', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#1A6B7A' }}>
              Earnings History
            </p>
          </div>
          {profile.earnings.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center' as const }}>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>No earnings yet. Complete sessions to start earning.</p>
            </div>
          )}
          {profile.earnings.map((e) => {
            const s = statusColor[e.status] ?? { bg: '#F3F4F6', text: '#6B7280' }
            return (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #F9FAFB' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1C2B3A' }}>
                    {e.session?.scheduledDate
                      ? new Date(e.session.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
                      : '—'}
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                    {e.session?.serviceCity ?? '—'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1C2B3A', fontFamily: 'monospace' }}>
                    ₹{e.amount.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 9999, background: s.bg, color: s.text }}>
                    {e.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
