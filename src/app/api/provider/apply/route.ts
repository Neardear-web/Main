import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { HardSkill, SoftSkill } from '@prisma/client'

const ReferenceSchema = z.object({
  name: z.string().min(1, 'Reference name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  relationship: z.string().min(1, 'Relationship is required'),
  yearsKnown: z.string().min(1, 'Years known is required'),
})

const ServiceSelectionSchema = z.object({
  serviceCategoryId: z.string().min(1),
  experienceLevel: z.enum(['FIRST_TIME', 'SOME_EXPERIENCE', 'CONFIDENT']),
  personalStatement: z.string().default(''),
})

const ApplicationSchema = z.object({
  // Step 1
  legalName: z.string().min(1, 'Legal name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  providerType: z.enum(['SOLO_COMPANION', 'TEAM_OPERATOR', 'PROFESSIONAL_ADVISOR']),
  whyThisWork: z.string().min(1, 'Why this work is required'),

  // Step 2
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  selfieUrl: z.string().optional().default(''),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional().default(''),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  addressProofUrl: z.string().optional().default(''),
  alternatePhone: z.string().optional().default(''),
  yearsAtAddress: z.string().min(1),

  // Step 3
  pccUrl: z.string().optional().default(''),
  pccIssuingAuth: z.string().optional().default(''),
  pccIssuedAt: z.string().optional().default(''),
  pccPending: z.boolean().default(false),

  // Step 4
  reference1: ReferenceSchema,
  reference2: ReferenceSchema,

  // Step 5
  selectedServices: z.array(ServiceSelectionSchema).min(1, 'Select at least one service'),

  // Step 6
  availableDays: z.array(z.string()).min(1),
  availableSlots: z.array(z.string()).min(1),
  weeklyHours: z.string().min(1),
  noticePeriod: z.string().min(1),
  serviceAreas: z.string().min(1),
  serviceRadiusKm: z.number().int().min(1).max(100),
  willingToTravel: z.boolean().default(false),
  hasVehicle: z.boolean().default(false),
  vehicleType: z.string().optional().default(''),

  // Step 7
  currentStatus: z.string().min(1),
  occupationCurrent: z.string().optional().default(''),
  occupationPast: z.string().optional().default(''),
  studyField: z.string().optional().default(''),
  ageRange: z.string().min(1),
  hardSkills: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  // Healthcare
  healthcareTrainingLevel: z.enum(['', 'FORMAL', 'EXPERIENCE', 'NONE']).default(''),
  healthcareQualifications: z.array(z.string()).default([]),
  clinicalTasksOffered: z.array(z.string()).default([]),
  physicalCareCapable: z.boolean().default(false),
  comfortableWithFluids: z.boolean().default(false),
  canLiftPatient: z.boolean().default(false),
  canDoNightShift: z.boolean().default(false),
  availableForLiveIn: z.boolean().default(false),
  healthcareExperienceNote: z.string().optional().default(''),

  // Step 8
  consentCodeOfConduct: z.literal(true, { error: 'Required' }),
  consentHardRules: z.literal(true, { error: 'Required' }),
  consentViolations: z.literal(true, { error: 'Required' }),
  consentAccuracy: z.literal(true, { error: 'Required' }),
  consentVerification: z.literal(true, { error: 'Required' }),
  digitalSignature: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ApplicationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 }
    )
  }

  const data = parsed.data

  // Verify digital signature matches legal name
  if (data.digitalSignature.trim().toLowerCase() !== data.legalName.trim().toLowerCase()) {
    return NextResponse.json(
      { error: 'Digital signature does not match legal name' },
      { status: 422 }
    )
  }

  try {
    // Check if a profile already exists for this user
    const existing = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted an application', applicationId: existing.id },
        { status: 409 }
      )
    }

    // 1. Create ProviderProfile
    const profile = await prisma.providerProfile.create({
      data: {
        userId: session.user.id,
        providerType: data.providerType,
        applicationStage: 'FULL_APPLICATION',
        legalName: data.legalName,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        aadhaarLast4: data.aadhaarNumber.slice(-4),
        selfieUrl: data.selfieUrl || null,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        addressProofUrl: data.addressProofUrl || null,
        yearsAtAddress: data.yearsAtAddress,
        alternatPhone: data.alternatePhone || null,
        pccUrl: data.pccUrl || null,
        pccStatus: 'PENDING',
        pccIssuedAt: data.pccIssuedAt ? new Date(data.pccIssuedAt) : null,
        pccIssuingAuth: data.pccIssuingAuth || null,
        whyThisWork: data.whyThisWork,
        availableDays: data.availableDays,
        availableSlots: data.availableSlots,
        weeklyHours: data.weeklyHours,
        noticePeriod: data.noticePeriod,
        serviceAreas: data.serviceAreas.split(',').map((s) => s.trim()).filter(Boolean),
        serviceRadiusKm: data.serviceRadiusKm,
        willingToTravel: data.willingToTravel,
        hasVehicle: data.hasVehicle,
        vehicleType: data.vehicleType || null,
        hardSkills: data.hardSkills as HardSkill[],
        softSkills: data.softSkills as SoftSkill[],
        languages: data.languages,
        currentStatus: data.currentStatus,
        occupationCurrent: data.occupationCurrent || null,
        occupationPast: data.occupationPast || null,
        studyField: data.studyField || null,
        ageRange: data.ageRange,
        preferredLanguage: 'EN',
        // Healthcare
        hasHealthcareTraining: data.healthcareTrainingLevel === 'FORMAL' || data.healthcareTrainingLevel === 'EXPERIENCE',
        healthcareQualifications: data.healthcareQualifications,
        clinicalTasksOffered: data.clinicalTasksOffered,
        physicalCareCapable: data.physicalCareCapable,
        comfortableWithFluids: data.comfortableWithFluids,
        canDoNightShift: data.canDoNightShift,
        availableForLiveIn: data.availableForLiveIn,
        healthcareExperienceNote: data.healthcareExperienceNote || null,
      },
    })

    // 2. Create CharacterReferences
    await prisma.characterReference.createMany({
      data: [data.reference1, data.reference2].map((ref) => ({
        providerProfileId: profile.id,
        name: ref.name,
        phone: ref.phone,
        relationship: ref.relationship,
        yearsKnown: ref.yearsKnown,
      })),
    })

    // 3. Create ServiceOfferings
    await prisma.serviceOffering.createMany({
      data: data.selectedServices.map((s) => ({
        providerProfileId: profile.id,
        serviceCategoryId: s.serviceCategoryId,
        experienceLevel: s.experienceLevel,
        personalStatement: s.personalStatement || null,
      })),
    })

    // 4. Create VerificationRecord
    await prisma.verificationRecord.create({
      data: {
        providerProfileId: profile.id,
        aadhaarStatus: 'PENDING',
        pccStatus: 'PENDING',
        ref1Status: 'PENDING',
        ref2Status: 'PENDING',
        overallStatus: 'PENDING',
      },
    })

    // 5. Create OrientationRecord
    await prisma.orientationRecord.create({
      data: { providerProfileId: profile.id },
    })

    // 6. Update user role
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'COMPANION' },
    })

    // 7. Create admin notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        channel: 'IN_APP',
        status: 'PENDING',
        title: 'New companion application',
        body: `${data.legalName} from ${data.city} has submitted a companion application.`,
        data: { providerProfileId: profile.id },
      },
    })

    return NextResponse.json({ applicationId: profile.id })
  } catch (err) {
    console.error('[provider/apply] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
