import { Suspense } from 'react'
import CarePlanCreateForm from '@/components/CarePlanCreateForm'

export const metadata = { title: 'Create Care Plan — NearDear' }

function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#FEF8F0', padding: '40px 24px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="animate-pulse" style={{ height: 32, background: '#E8E0D8', borderRadius: 8, marginBottom: 12, width: '60%' }} />
        <div className="animate-pulse" style={{ height: 16, background: '#E8E0D8', borderRadius: 8, marginBottom: 24, width: '40%' }} />
        <div className="animate-pulse" style={{ height: 80, background: '#E8E0D8', borderRadius: 16, marginBottom: 16 }} />
        <div className="animate-pulse" style={{ height: 160, background: '#E8E0D8', borderRadius: 16, marginBottom: 16 }} />
        <div className="animate-pulse" style={{ height: 120, background: '#E8E0D8', borderRadius: 16, marginBottom: 16 }} />
      </div>
    </div>
  )
}

export default function CarePlanCreatePage() {
  return (
    <Suspense fallback={<Loading />}>
      <CarePlanCreateForm />
    </Suspense>
  )
}
