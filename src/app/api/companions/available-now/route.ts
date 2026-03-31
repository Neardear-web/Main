import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  available: z.boolean(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userRole = (session.user as { role?: string }).role
  if (userRole !== 'COMPANION') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { available } = parsed.data

  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  if (!providerProfile) {
    return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
  }

  await prisma.providerProfile.update({
    where: { id: providerProfile.id },
    data: {
      availableNow: available,
      availableNowSince: available ? new Date() : null,
    },
  })

  return NextResponse.json({ availableNow: available })
}
