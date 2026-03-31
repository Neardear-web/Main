import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        cluster: true,
        mode: true,
        descriptionProvider: true,
        descriptionReceiver: true,
        suggestedFeeMin: true,
        suggestedFeeMax: true,
        minTrustLevel: true,
        requiresVehicle: true,
      },
    })
    return NextResponse.json(services)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
