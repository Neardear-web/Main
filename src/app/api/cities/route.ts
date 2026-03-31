import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true, state: true },
    })
    return NextResponse.json(cities)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
