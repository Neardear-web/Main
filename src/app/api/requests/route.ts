import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { extractRequest } from '@/lib/ai/extract-request'

const schema = z.object({
  elderName: z.string().min(1),
  elderCity: z.string().min(1),
  elderPhone: z.string().optional(),
  elderAgeRange: z.string().min(1),
  elderPrimaryLanguage: z.string().min(1),
  elderHealthNotes: z.string().optional(),
  emergencyContactName: z.string().min(1),
  emergencyContactPhone: z.string().min(1),
  genderPreference: z.enum(['FEMALE', 'MALE', 'NO_PREFERENCE']),
  // Elder care needs
  elderMobilityLevel: z.string().optional(),
  elderPersonalCareNeeds: z.array(z.string()).default([]),
  elderMedicalEquipment: z.array(z.string()).default([]),
  elderCareHoursPerDay: z.string().optional(),
  elderCareFrequency: z.string().optional(),
  descriptionRaw: z.string(),
  selectedServiceIds: z.array(z.string()),
  notSureSelected: z.boolean(),
  timingType: z.enum(['SPECIFIC_DATE', 'THIS_WEEK', 'RECURRING']),
  preferredDate: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  isRecurring: z.boolean(),
  recurringFreq: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY']).optional().nullable(),
  whoNeedsHelp: z.enum(['MYSELF', 'PARENT', 'SOMEONE_ELSE']),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data
  const userId = session.user.id

  const elderProfile = await prisma.elderProfile.create({
    data: {
      familyUserId: userId,
      name: data.elderName,
      city: data.elderCity,
      phone: data.elderPhone ?? null,
      ageRange: data.elderAgeRange,
      primaryLanguage: data.elderPrimaryLanguage,
      healthNotes: data.elderHealthNotes ?? null,
      emergencyContact: data.emergencyContactPhone,
      emergencyName: data.emergencyContactName,
      genderPreference: data.genderPreference,
      mobilityLevel: data.elderMobilityLevel ?? null,
      personalCareNeeds: data.elderPersonalCareNeeds,
      medicalEquipment: data.elderMedicalEquipment,
      careShiftType: data.elderCareHoursPerDay ?? null,
      careFrequency: data.elderCareFrequency ?? null,
      consentGiven: true,
      consentAt: new Date(),
    },
  })

  const request = await prisma.request.create({
    data: {
      userId,
      elderProfileId: elderProfile.id,
      descriptionRaw: data.descriptionRaw || 'Service request via NearDear',
      serviceCity: data.elderCity,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      preferredTimeSlot: data.preferredTimeSlot ?? null,
      isRecurring: data.isRecurring,
      recurringFreq: data.recurringFreq ?? null,
      genderPreference: data.genderPreference,
      status: 'SUBMITTED',
    },
  })

  if (data.selectedServiceIds.length > 0) {
    await prisma.requestService.createMany({
      data: data.selectedServiceIds.map((serviceId, index) => ({
        requestId: request.id,
        serviceCategoryId: serviceId,
        isPrimary: index === 0,
      })),
    })
  }

  if (data.descriptionRaw) {
    extractRequest(data.descriptionRaw)
      .then(async (extracted) => {
        await prisma.request
          .update({
            where: { id: request.id },
            data: { aiExtractedData: extracted as object },
          })
          .catch(console.error)
      })
      .catch(console.error)
  }

  return NextResponse.json({ requestId: request.id })
}
