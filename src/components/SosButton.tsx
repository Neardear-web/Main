'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language'

const copy = {
  EN: {
    label: 'NEED HELP RIGHT NOW?',
    heading: 'Need someone right now in Ahmedabad?',
    subtext: 'A real person. Within the hour.',
    cta: 'I need help right now →',
  },
  GU: {
    label: 'અત્યારે મદદ જોઈએ?',
    heading: 'અત્યારે અમદાવાદમાં કોઈ જોઈએ?',
    subtext: 'એક સાચો માણસ. એક કલાકમાં.',
    cta: 'મને અત્યારે મદદ જોઈએ →',
  },
  HI: {
    label: 'अभी मदद चाहिए?',
    heading: 'अभी अहमदाबाद में कोई चाहिए?',
    subtext: 'एक असली इंसान। एक घंटे के भीतर।',
    cta: 'मुझे अभी मदद चाहिए →',
  },
}

export default function SosButton() {
  const { lang } = useLanguage()
  const t = copy[lang]

  return (
    <div
      className="rounded-2xl border-l-4 border-[#E07B2F] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      style={{ background: '#1C2B3A' }}
    >
      {/* Left side */}
      <div className="flex flex-col gap-1">
        <span
          className="text-xs uppercase tracking-widest font-medium"
          style={{ color: '#E07B2F' }}
        >
          {t.label}
        </span>
        <p className="text-white font-semibold text-lg leading-snug">
          {t.heading}
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {t.subtext}
        </p>
      </div>

      {/* Right side — CTA */}
      <div className="flex-shrink-0">
        <Link
          href="/sos"
          className="inline-block rounded-xl px-6 py-3 font-semibold text-white text-sm transition-opacity hover:opacity-90"
          style={{ background: '#E07B2F' }}
        >
          {t.cta}
        </Link>
      </div>
    </div>
  )
}
