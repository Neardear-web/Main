import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'sans-serif'
    }}>
      <h1>Authentication Working ✓</h1>
      <p>Phone: {session.user?.phone}</p>
      <p>Role: {session.user?.role}</p>
      <p>User ID: {session.user?.id}</p>
    </div>
  )
}
