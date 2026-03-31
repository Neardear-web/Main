import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { findMatches, MatchResult } from '@/lib/matching'
import { sendNewRequestSms } from '@/lib/sms'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Load request and verify ownership
  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      elderProfile: true,
      requestServices: { include: { serviceCategory: true } },
    },
  })

  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  if (request.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check for existing cached matches
  const existingMatches = await prisma.match.findMany({
    where: { requestId: id },
    orderBy: { rank: 'asc' },
  })

  if (existingMatches.length > 0) {
    // Load companion details for each cached match
    const companionIds = existingMatches.map((m) => m.providerProfileId)

    const companions = await prisma.providerProfile.findMany({
      where: { id: { in: companionIds } },
    })

    const companionMap = new Map(companions.map((c) => [c.id, c]))

    const matches = existingMatches
      .map((m) => {
        const companion = companionMap.get(m.providerProfileId)
        if (!companion) return null

        let cardCopy: { en: string; gu: string } = { en: '', gu: '' }
        if (m.cardCopy) {
          try {
            cardCopy = JSON.parse(m.cardCopy) as { en: string; gu: string }
          } catch {
            cardCopy = { en: m.cardCopy, gu: '' }
          }
        }

        const matchReason = m.matchReason as { aiReason?: string; aiScore?: number } | null

        return {
          rank: m.rank,
          totalScore: m.matchScore ?? 0,
          aiScore: matchReason?.aiScore ?? 50,
          aiReason: matchReason?.aiReason ?? '',
          cardCopy,
          companion: {
            id: companion.id,
            userId: companion.userId,
            legalName: companion.legalName,
            city: companion.city,
            trustLevel: companion.trustLevel,
            totalSessions: companion.totalSessions,
            avgFeedbackScore: companion.avgFeedbackScore,
            occupationCurrent: companion.occupationCurrent,
            occupationPast: companion.occupationPast,
            currentStatus: companion.currentStatus,
            ageRange: companion.ageRange,
            languages: companion.languages,
            hardSkills: companion.hardSkills as string[],
            softSkills: companion.softSkills as string[],
            selfieUrl: companion.selfieUrl,
            gender: companion.gender,
            reliabilityScore: companion.reliabilityScore,
          },
        } as MatchResult
      })
      .filter((m): m is MatchResult => m !== null)

    const firstService = request.requestServices[0]
    return NextResponse.json({
      matches,
      request: {
        serviceCity: request.serviceCity,
        elderName: request.elderProfile?.name ?? null,
      },
      service: firstService ? {
        id: firstService.serviceCategory.id,
        name: firstService.serviceCategory.name,
        slug: firstService.serviceCategory.slug,
        suggestedFeeMin: firstService.serviceCategory.suggestedFeeMin,
      } : null,
    })
  }

  // No cached matches — run matching engine
  try {
    const matches = await findMatches(id)

    // SMS each matched companion — fire-and-forget
    const userIds = matches.map((m) => m.companion.userId).filter(Boolean)
    if (userIds.length > 0) {
      prisma.user
        .findMany({ where: { id: { in: userIds } }, select: { id: true, phone: true } })
        .then((users) => {
          const phoneMap = new Map(users.map((u) => [u.id, u.phone]))
          for (const m of matches) {
            const phone = phoneMap.get(m.companion.userId)
            if (phone) sendNewRequestSms(phone, '').catch(console.error)
          }
        })
        .catch(console.error)
    }

    const firstService = request.requestServices[0]
    return NextResponse.json({
      matches,
      request: {
        serviceCity: request.serviceCity,
        elderName: request.elderProfile?.name ?? null,
      },
      service: firstService ? {
        id: firstService.serviceCategory.id,
        name: firstService.serviceCategory.name,
        slug: firstService.serviceCategory.slug,
        suggestedFeeMin: firstService.serviceCategory.suggestedFeeMin,
      } : null,
    })
  } catch (err) {
    console.error('[GET /api/requests/[id]/matches] findMatches error:', err)
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
  }
}
