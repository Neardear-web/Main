import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSosFoundSms } from '@/lib/sms'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: sosId } = await params

  // Companion must have an active profile
  const companion = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, legalName: true, accountStatus: true },
  })

  if (!companion || companion.accountStatus !== 'ACTIVE') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const sosRequest = await prisma.sosRequest.findUnique({
    where: { id: sosId },
  })

  if (!sosRequest) {
    return NextResponse.json({ error: 'SOS request not found' }, { status: 404 })
  }

  if (sosRequest.status !== 'SEARCHING') {
    return NextResponse.json(
      { error: `SOS request is no longer available (status: ${sosRequest.status})` },
      { status: 409 }
    )
  }

  await prisma.sosRequest.update({
    where: { id: sosId },
    data: {
      status: 'COMPANION_FOUND',
      assignedCompanionId: companion.id,
    },
  })

  // SMS to requester — fire-and-forget
  const caseId = sosId.slice(0, 8).toUpperCase()
  sendSosFoundSms(sosRequest.phone, companion.legalName, caseId).catch(console.error)

  return NextResponse.json({ success: true, caseId })
}
