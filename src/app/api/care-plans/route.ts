import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculatePlan } from '@/lib/carePlan'
import { PlanFrequency, PlanDuration, PlanBilling } from '@prisma/client'

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

const DURATION_MONTHS: Record<string, number> = {
  ONE_MONTH: 1,
  THREE_MONTHS: 3,
  SIX_MONTHS: 6,
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plans = await prisma.carePlan.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      providerProfile: { select: { legalName: true, selfieUrl: true } },
    },
  })

  return NextResponse.json(plans)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    providerProfileId,
    serviceCategoryId,
    elderProfileId,
    frequency,
    duration,
    billing,
    preferredDays,
    preferredTime,
  } = body as {
    providerProfileId: string
    serviceCategoryId: string
    elderProfileId?: string
    frequency: string
    duration: string
    billing: string
    preferredDays: string[]
    preferredTime?: string
  }

  if (!providerProfileId || !serviceCategoryId || !frequency || !duration || !billing) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!Object.values(PlanFrequency).includes(frequency as PlanFrequency)) {
    return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 })
  }
  if (!Object.values(PlanDuration).includes(duration as PlanDuration)) {
    return NextResponse.json({ error: 'Invalid duration' }, { status: 400 })
  }
  if (!Object.values(PlanBilling).includes(billing as PlanBilling)) {
    return NextResponse.json({ error: 'Invalid billing' }, { status: 400 })
  }

  const [service, companion] = await Promise.all([
    prisma.serviceCategory.findUnique({
      where: { id: serviceCategoryId },
      select: { id: true, suggestedFeeMin: true },
    }),
    prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
      select: { id: true, legalName: true, user: { select: { phone: true } } },
    }),
  ])

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }
  if (!companion) {
    return NextResponse.json({ error: 'Companion not found' }, { status: 404 })
  }

  const calc = calculatePlan(service.suggestedFeeMin, frequency, duration, billing)

  const now = new Date()
  const months = DURATION_MONTHS[duration] ?? 1
  const endDate = addMonths(now, months)
  const nextBillingDate =
    billing === 'MONTHLY' ? addMonths(now, 1) : null

  const plan = await prisma.carePlan.create({
    data: {
      userId: session.user.id,
      elderProfileId: elderProfileId ?? null,
      providerProfileId,
      serviceCategoryId,
      frequency: frequency as PlanFrequency,
      duration: duration as PlanDuration,
      billing: billing as PlanBilling,
      totalSessions: calc.totalSessions,
      sessionsCompleted: 0,
      sessionsRemaining: calc.totalSessions,
      preferredDays: preferredDays ?? [],
      preferredTime: preferredTime ?? null,
      regularPricePerVisit: calc.regularPricePerVisit,
      discountPercent: calc.discountPercent,
      planPricePerVisit: calc.planPricePerVisit,
      totalRegularPrice: calc.totalRegularPrice,
      totalPlanPrice: calc.totalPlanPrice,
      totalSavings: calc.totalSavings,
      upfrontExtraDiscount: calc.upfrontExtraDiscount,
      monthlyAmount: calc.monthlyAmount,
      nextBillingDate,
      status: 'ACTIVE',
      startDate: now,
      endDate,
    },
  })

  return NextResponse.json({ success: true, planId: plan.id, plan })
}
