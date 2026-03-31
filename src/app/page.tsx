import Header from '@/components/hero/Header'
import HeroSplit from '@/components/hero/HeroSplit'
import SosButton from '@/components/SosButton'
import TrustBar from '@/components/hero/TrustBar'
import AgencyComparison from '@/components/hero/AgencyComparison'
import WhyNearDear from '@/components/hero/WhyNearDear'
import HowItWorks from '@/components/hero/HowItWorks'
import ServicesGrid from '@/components/hero/ServicesGrid'
import MatchCards from '@/components/hero/MatchCards'
import NRISection from '@/components/hero/NRISection'
import EarningsSection from '@/components/hero/EarningsSection'
import VerificationSection from '@/components/hero/VerificationSection'
import Footer from '@/components/hero/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSplit />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <SosButton />
      </div>
      <TrustBar />
      <AgencyComparison />
      <WhyNearDear />
      <HowItWorks />
      <ServicesGrid />
      <MatchCards />
      <NRISection />
      <EarningsSection />
      <VerificationSection />
      <Footer />
    </main>
  )
}
