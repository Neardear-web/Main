import { Prisma, TrustLevel } from '@prisma/client'
import { prisma } from './prisma'
import { scoreCompanionMatch } from './ai/score-match'
import { generateMatchCard } from './ai/match-card'
import { extractRequest } from './ai/extract-request'

export interface MatchResult {
  rank: number
  totalScore: number
  aiScore: number
  aiReason: string
  cardCopy: { en: string; gu: string }
  companion: {
    id: string // providerProfileId
    userId: string
    legalName: string
    city: string
    trustLevel: TrustLevel
    totalSessions: number
    avgFeedbackScore: number | null
    occupationCurrent: string | null
    occupationPast: string | null
    currentStatus: string | null
    ageRange: string | null
    languages: string[]
    hardSkills: string[]
    softSkills: string[]
    selfieUrl: string | null
    gender: string | null
    reliabilityScore: number
  }
}

export async function findMatches(requestId: string): Promise<MatchResult[]> {
  // STEP 1 — Load request
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      requestServices: {
        include: {
          serviceCategory: true,
        },
      },
      elderProfile: true,
      user: true,
    },
  })

  if (!request) throw new Error('Request not found')

  // STEP 2 — Run AI extraction if not already done
  let aiData = request.aiExtractedData as Record<string, unknown> | null
  if (!aiData && request.descriptionRaw) {
    try {
      const extracted = await extractRequest(request.descriptionRaw)
      aiData = extracted as unknown as Record<string, unknown>
      await prisma.request.update({
        where: { id: requestId },
        data: { aiExtractedData: aiData as object },
      })
    } catch (e) {
      console.error('[matching] AI extraction failed:', e)
    }
  }

  // STEP 3 — Determine requirements
  const services = request.requestServices.map((rs) => rs.serviceCategory)

  // Highest trust level among requested services
  const trustOrder = ['LEVEL_0', 'LEVEL_1', 'LEVEL_2', 'LEVEL_3']
  const minTrustLevel = services.reduce((max, svc) => {
    const idx = trustOrder.indexOf(svc.minTrustLevel)
    return idx > trustOrder.indexOf(max) ? svc.minTrustLevel : max
  }, 'LEVEL_0' as string)

  const vehicleRequired = services.some((s) => s.requiresVehicle)
  const serviceIds = services.map((s) => s.id)

  // Gender filter
  const genderPref = request.genderPreference ?? 'NO_PREFERENCE'

  // STEP 4 — Database filter
  const whereClause: Prisma.ProviderProfileWhereInput = {
    city: request.serviceCity,
    accountStatus: 'ACTIVE',
    trustLevel: { in: trustOrder.slice(trustOrder.indexOf(minTrustLevel)) as ('LEVEL_0' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3')[] },
    serviceOfferings: {
      some: {
        serviceCategoryId: { in: serviceIds },
        isActive: true,
      },
    },
  }

  if (vehicleRequired) {
    whereClause.hasVehicle = true
  }

  if (genderPref === 'FEMALE') {
    whereClause.gender = 'FEMALE'
  } else if (genderPref === 'MALE') {
    whereClause.gender = 'MALE'
  }

  const companions = await prisma.providerProfile.findMany({
    where: whereClause,
    include: {
      serviceOfferings: {
        where: { isActive: true },
        include: { serviceCategory: true },
      },
    },
    take: 20, // fetch up to 20, score and take top 5
  })

  if (companions.length === 0) return []

  // STEP 5 — Score each companion
  const elderAge = request.elderProfile?.ageRange ?? null
  const elderLanguage = request.elderProfile?.primaryLanguage ?? null

  const scored = await Promise.all(
    companions.map(async (companion) => {
      // Local scores
      let experienceScore = 0
      const sessions = companion.totalSessions
      if (sessions >= 16) experienceScore = 30
      else if (sessions >= 6) experienceScore = 20
      else if (sessions >= 1) experienceScore = 10

      const reliabilityScore = Math.round((companion.reliabilityScore / 100) * 20)

      // Language match
      let languageScore = 0
      if (elderLanguage) {
        const langs = companion.languages.map((l) => l.toLowerCase())
        if (langs.includes(elderLanguage.toLowerCase())) languageScore = 15
        else if (langs.some((l) => l.startsWith(elderLanguage.toLowerCase().slice(0, 2)))) languageScore = 8
      } else {
        languageScore = 8 // neutral
      }

      // Age compatibility
      let ageScore = 10 // neutral default
      const companionAge = companion.ageRange ?? ''
      const isElderCare = services.some((s) =>
        ['elder-visit', 'companion-visit', 'check-on-parents', 'hospital-help'].includes(s.slug)
      )
      const isStudentSupport = services.some((s) => s.slug === 'student-support')

      if (isElderCare && elderAge) {
        const elderAgeNum = parseInt(elderAge.replace(/\D.*/, ''))
        if (elderAgeNum >= 70) {
          if (['46-55', '56-65'].some((r) => companionAge.includes(r.split('-')[0]))) ageScore = 15
          else if (companionAge.includes('36')) ageScore = 10
          else if (companionAge.includes('26')) ageScore = 5
          else ageScore = 2
        }
      } else if (isStudentSupport) {
        if (['18-25', '26-35'].some((r) => companionAge.includes(r.split('-')[0]))) ageScore = 15
        else ageScore = 5
      }

      // AI score
      let aiScore = 50
      let aiReason = 'Good match for your needs'
      console.log('[AI KEY CHECK]', !!process.env.ANTHROPIC_API_KEY)
      try {
        const occupation = companion.occupationCurrent ?? companion.occupationPast ?? companion.currentStatus ?? ''
        const HEALTHCARE_SLUGS_SCORE = [
          'basic-elder-care', 'personal-care', 'diaper-care',
          'medication-management', 'bedridden-care', 'day-shift-care',
          'night-shift-care', 'live-in-care',
        ]
        const isHC = services.some((s) => HEALTHCARE_SLUGS_SCORE.includes(s.slug))
        const result = await scoreCompanionMatch(
          {
            description: request.descriptionRaw,
            services: services.map((s) => s.slug),
            elderAge: elderAge ?? undefined,
            isUrgent: request.isUrgent,
            isHealthcareRequest: isHC,
          },
          {
            occupation,
            currentStatus: companion.currentStatus ?? '',
            ageRange: companion.ageRange ?? '',
            hardSkills: companion.hardSkills as string[],
            softSkills: companion.softSkills as string[],
            sessionsCompleted: companion.totalSessions,
            reliabilityScore: companion.reliabilityScore,
          }
        )
        aiScore = result.score
        aiReason = result.reason
        console.log('[AI SCORE SUCCESS]', { score: aiScore, reason: aiReason })
      } catch (e) {
        console.error('[AI SCORE FAIL]', e)
      }

      // ── Healthcare matching boost ─────────────────────
      const HEALTHCARE_SLUGS = [
        'basic-elder-care', 'personal-care', 'diaper-care',
        'medication-management', 'bedridden-care', 'day-shift-care',
        'night-shift-care', 'live-in-care',
      ]
      const isHealthcareRequest = services.some((s) => HEALTHCARE_SLUGS.includes(s.slug))

      let healthcareScore = 0
      if (isHealthcareRequest) {
        const needsPersonalCare = (request.elderProfile?.personalCareNeeds?.length ?? 0) > 0
        const elderBedridden = request.elderProfile?.mobilityLevel === 'BEDRIDDEN'

        if (companion.hasHealthcareTraining) healthcareScore += 20

        if (needsPersonalCare && companion.physicalCareCapable) healthcareScore += 15

        if (elderBedridden && companion.clinicalTasksOffered.includes('PATIENT_POSITIONING')) {
          healthcareScore += 10
        }

        if (request.elderProfile?.careShiftType === 'NIGHT_SHIFT' && companion.canDoNightShift) {
          healthcareScore += 15
        }

        if (request.elderProfile?.careShiftType === 'LIVE_IN' && companion.availableForLiveIn) {
          healthcareScore += 15
        }
      }

      const totalScore = experienceScore + reliabilityScore + languageScore + ageScore + Math.round(aiScore * 0.35) + healthcareScore

      return { companion, totalScore, aiScore, aiReason }
    })
  )

  // STEP 6 — Sort and take top 5
  const top5 = scored
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5)

  // STEP 7 — Generate match card copy for top 5
  const results: MatchResult[] = await Promise.all(
    top5.map(async ({ companion, totalScore, aiScore, aiReason }, idx) => {
      let cardCopy: { en: string; gu: string } = { en: aiReason, gu: '' }
      try {
        console.log('[MATCH CARD GENERATING]', {
          companionName: companion.legalName,
          occupation: companion.occupationCurrent ?? companion.occupationPast ?? companion.currentStatus,
          city: companion.city,
          sessions: companion.totalSessions,
          requestDescription: request.descriptionRaw.slice(0, 100),
        })
        cardCopy = await generateMatchCard(
          {
            name: companion.legalName,
            city: companion.city,
            totalSessions: companion.totalSessions,
            hardSkills: companion.hardSkills as string[],
            softSkills: companion.softSkills as string[],
            languages: companion.languages,
            avgFeedbackScore: companion.avgFeedbackScore ?? undefined,
          },
          {
            summary: request.descriptionRaw.slice(0, 200),
            serviceTypes: services.map((s) => s.slug),
          }
        )
        console.log('[MATCH CARD SUCCESS]', cardCopy.en.substring(0, 100))
      } catch (e) {
        console.error('[MATCH CARD FAIL]', e)
      }

      return {
        rank: idx + 1,
        totalScore,
        aiScore,
        aiReason,
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
      }
    })
  )

  // STEP 8 — Save match records
  await Promise.all(
    results.map((r) =>
      prisma.match
        .create({
          data: {
            requestId,
            providerProfileId: r.companion.id,
            rank: r.rank,
            matchScore: r.totalScore,
            matchReason: { aiReason: r.aiReason },
            cardCopy: JSON.stringify(r.cardCopy),
            status: 'SHOWN',
          },
        })
        .catch((err: unknown) => {
          // Silently skip duplicate inserts (re-run of matching)
          console.warn('[matching] match create skipped:', err)
        })
    )
  )

  // STEP 9 — Create RequestNotifications for top 3
  const top3 = results.slice(0, 3)
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000)

  await Promise.all(
    top3.map(async (r) => {
      // Don't duplicate
      const existing = await prisma.requestNotification.findFirst({
        where: { requestId, providerProfileId: r.companion.id },
      })
      if (existing) return

      await prisma.requestNotification.create({
        data: {
          requestId,
          providerProfileId: r.companion.id,
          status: 'SENT',
          expiresAt,
        },
      })

      // Log (FCM will replace this when mobile app is built)
      const primaryService = services[0]
      const fee = primaryService?.suggestedFeeMin ?? 0
      const earnings = Math.round(fee * 0.8)
      console.log(
        `[MATCH NOTIFY] Companion: ${r.companion.legalName} | Request: ${requestId} | Service: ${primaryService?.name ?? 'Unknown'} | Earnings: ₹${earnings}`
      )
    })
  )

  // STEP 10 — Update request status
  await prisma.request.update({
    where: { id: requestId },
    data: { status: 'COMPANION_NOTIFIED' },
  })

  return results
}
