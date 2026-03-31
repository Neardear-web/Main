import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import IntroCallPrompt from './IntroCallPrompt'

export default async function RequestAcceptedPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      elderProfile: true,
      requestServices: { include: { serviceCategory: true } },
      session: {
        include: {
          companion: {
            include: { user: true },
          },
        },
      },
    },
  })

  if (!request || request.userId !== session.user.id) redirect('/dashboard')
  if (request.status !== 'ACCEPTED') redirect(`/request/${id}/matches`)

  const companion = request.session?.companion
  const companionName = companion?.legalName ?? 'Your companion'
  const companionUserId = companion?.userId ?? ''

  return (
    <div
      className="min-h-screen"
      style={{ background: '#FEF8F0', padding: '40px 24px' }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Accepted banner */}
        <div
          className="rounded-2xl p-6 mb-6 text-center"
          style={{ background: '#4A8C6F', color: 'white' }}
        >
          <div className="text-4xl mb-3">✓</div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {companionName} has accepted your request
          </h1>
          <p className="text-sm opacity-80">
            {request.elderProfile?.name} · {request.serviceCity}
          </p>
        </div>

        {/* Services confirmed */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'white', border: '1px solid #E8E0D8' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#1A6B7A' }}>
            Services confirmed
          </p>
          <div className="flex flex-wrap gap-2">
            {request.requestServices.map((rs) => (
              <span
                key={rs.id}
                className="rounded-full px-3 py-1 text-sm"
                style={{ background: '#1A6B7A', color: 'white' }}
              >
                {rs.serviceCategory.name}
              </span>
            ))}
          </div>
        </div>

        {/* Intro call prompt */}
        <IntroCallPrompt
          requestId={id}
          companionName={companionName}
          companionUserId={companionUserId}
          guestUserId={session.user.id}
        />

      </div>
    </div>
  )
}
