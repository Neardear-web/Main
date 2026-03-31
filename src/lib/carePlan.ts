export const DISCOUNT_MATRIX: Record<string, Record<string, number>> = {
  ONE_MONTH: {
    ONCE_WEEKLY:      0,
    TWICE_WEEKLY:     5,
    THREE_WEEKLY:     8,
    DAILY_WEEKDAYS:   10,
  },
  THREE_MONTHS: {
    ONCE_WEEKLY:      8,
    TWICE_WEEKLY:     12,
    THREE_WEEKLY:     15,
    DAILY_WEEKDAYS:   18,
  },
  SIX_MONTHS: {
    ONCE_WEEKLY:      15,
    TWICE_WEEKLY:     18,
    THREE_WEEKLY:     20,
    DAILY_WEEKDAYS:   25,
  },
}

export const SESSIONS_MAP: Record<string, Record<string, number>> = {
  ONE_MONTH: {
    ONCE_WEEKLY:      4,
    TWICE_WEEKLY:     8,
    THREE_WEEKLY:     12,
    DAILY_WEEKDAYS:   20,
  },
  THREE_MONTHS: {
    ONCE_WEEKLY:      13,
    TWICE_WEEKLY:     26,
    THREE_WEEKLY:     39,
    DAILY_WEEKDAYS:   65,
  },
  SIX_MONTHS: {
    ONCE_WEEKLY:      26,
    TWICE_WEEKLY:     52,
    THREE_WEEKLY:     78,
    DAILY_WEEKDAYS:   130,
  },
}

export const UPFRONT_EXTRA_DISCOUNT = 2

export function calculatePlan(
  regularPricePerVisit: number,
  frequency: string,
  duration: string,
  billing: string
) {
  const discountPct =
    DISCOUNT_MATRIX[duration]?.[frequency] ?? 0

  const extraDiscount =
    billing === 'UPFRONT'
      ? UPFRONT_EXTRA_DISCOUNT : 0

  const totalDiscountPct =
    discountPct + extraDiscount

  const totalSessions =
    SESSIONS_MAP[duration]?.[frequency] ?? 0

  const regularTotal =
    regularPricePerVisit * totalSessions

  const planPricePerVisit = Math.round(
    regularPricePerVisit *
    (1 - totalDiscountPct / 100)
  )

  const planTotal =
    planPricePerVisit * totalSessions

  const savings = regularTotal - planTotal

  const monthlyAmount =
    billing === 'MONTHLY'
      ? Math.round(planTotal /
          (duration === 'ONE_MONTH' ? 1
           : duration === 'THREE_MONTHS' ? 3
           : 6))
      : null

  return {
    totalSessions,
    discountPercent: discountPct,
    upfrontExtraDiscount: extraDiscount,
    totalDiscountPercent: totalDiscountPct,
    regularPricePerVisit,
    planPricePerVisit,
    totalRegularPrice: regularTotal,
    totalPlanPrice: planTotal,
    totalSavings: savings,
    monthlyAmount,
  }
}
