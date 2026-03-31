import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const sosRequest = await prisma.sosRequest.findUnique({
    where: { id },
  })

  if (!sosRequest) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let companionName: string | undefined

  if (sosRequest.status === 'COMPANION_FOUND' && sosRequest.assignedCompanionId) {
    const companion = await prisma.providerProfile.findUnique({
      where: { id: sosRequest.assignedCompanionId },
      select: { legalName: true },
    })
    companionName = companion?.legalName ?? undefined
  }

  return NextResponse.json({
    status: sosRequest.status,
    area: sosRequest.area,
    companionName,
    updatedAt: sosRequest.updatedAt,
  })
}
