import { prisma } from '@/lib/prisma'

export async function getCompanionRate(
  providerProfileId: string,
  citySlug: string,
  sessionDate: Date
): Promise<{
  companionPct: number
  platformPct: number
  source: 'INDIVIDUAL' | 'CITY' | 'GLOBAL'
}> {
  // STEP 1: Individual rate (highest priority)
  const individualRate = await prisma.companionRateConfig.findFirst({
    where: {
      providerProfileId,
      isActive: true,
      effectiveFrom: { lte: sessionDate },
      OR: [
        { effectiveTo: null },
        { effectiveTo: { gte: sessionDate } },
      ],
    },
  })

  if (individualRate) {
    return {
      companionPct: individualRate.companionSharePct,
      platformPct: individualRate.platformSharePct,
      source: 'INDIVIDUAL',
    }
  }

  // STEP 2: City rate
  // CityRateConfig.cityId references City.id — resolve slug → id first
  const city = await prisma.city.findUnique({ where: { slug: citySlug } })

  if (city) {
    const cityRate = await prisma.cityRateConfig.findUnique({
      where: { cityId: city.id },
    })

    if (cityRate && cityRate.effectiveFrom <= sessionDate) {
      return {
        companionPct: cityRate.companionSharePct,
        platformPct: cityRate.platformSharePct,
        source: 'CITY',
      }
    }
  }

  // STEP 3: Global platform rate (most recent active config on or before sessionDate)
  const globalRate = await prisma.platformRateConfig.findFirst({
    where: {
      isActive: true,
      effectiveFrom: { lte: sessionDate },
    },
    orderBy: { effectiveFrom: 'desc' },
  })

  return {
    companionPct: globalRate?.companionSharePct ?? 80,
    platformPct: globalRate?.platformSharePct ?? 20,
    source: 'GLOBAL',
  }
}

export function calculateEarnings(
  sessionFee: number,
  companionPct: number
): { companionShare: number; platformShare: number } {
  const companionShare = Math.round((sessionFee * companionPct) / 100)
  const platformShare = sessionFee - companionShare
  return { companionShare, platformShare }
}
