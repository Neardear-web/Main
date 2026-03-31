import { PrismaClient, CityStatus, ServiceCluster, ServiceMode, TrustLevel, SensitivityLevel, VerificationStatus, ExperienceLevel, ProviderType, ApplicationStage, AccountStatus, Role, Gender } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'

config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {

  console.log('Seeding cities...')

  const cities = [
    {
      name: 'Ahmedabad',
      slug: 'ahmedabad',
      state: 'Gujarat',
      status: CityStatus.ACTIVE,
      isPhase1: true,
      sortOrder: 1
    },
    {
      name: 'Gandhinagar',
      slug: 'gandhinagar',
      state: 'Gujarat',
      status: CityStatus.ACTIVE,
      isPhase1: true,
      sortOrder: 2
    },
    {
      name: 'Surat',
      slug: 'surat',
      state: 'Gujarat',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 3
    },
    {
      name: 'Vadodara',
      slug: 'vadodara',
      state: 'Gujarat',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 4
    },
    {
      name: 'Rajkot',
      slug: 'rajkot',
      state: 'Gujarat',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 5
    },
    {
      name: 'Mumbai',
      slug: 'mumbai',
      state: 'Maharashtra',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 6
    },
    {
      name: 'Pune',
      slug: 'pune',
      state: 'Maharashtra',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 7
    },
    {
      name: 'Bengaluru',
      slug: 'bengaluru',
      state: 'Karnataka',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 8
    },
    {
      name: 'Delhi',
      slug: 'delhi',
      state: 'Delhi',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 9
    },
    {
      name: 'Hyderabad',
      slug: 'hyderabad',
      state: 'Telangana',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 10
    },
    {
      name: 'Chennai',
      slug: 'chennai',
      state: 'Tamil Nadu',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 11
    },
    {
      name: 'Kolkata',
      slug: 'kolkata',
      state: 'West Bengal',
      status: CityStatus.COMING_SOON,
      isPhase1: false,
      sortOrder: 12
    },
  ]

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city,
    })
  }
  console.log(`✓ ${cities.length} cities seeded`)

  console.log('Seeding service categories...')

  const services = [

    // CLUSTER A — PRESENCE
    {
      name: 'Elder Support Visit',
      slug: 'elder-visit',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Scheduled home visit. Sit, converse, observe wellbeing, submit a structured note to the family after every visit. Vehicle helpful. Strong empathy essential.',
      descriptionReceiver: 'A trusted person visits your parent, spends real time with them, and sends you a detailed note after every visit.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 600,
      suggestedFeeMax: 900,
      requiresVehicle: false,
      sensitivityLevel: SensitivityLevel.HIGH,
      sortOrder: 1,
    },
    {
      name: 'Check-on-Parents',
      slug: 'check-on-parents',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Welfare visit for parents whose family lives far away. GPS check-in required. Structured report sent to family after every visit.',
      descriptionReceiver: 'Someone visits your parent, confirms they are well, and sends you a report — from anywhere in the world.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 500,
      suggestedFeeMax: 800,
      requiresVehicle: false,
      sortOrder: 2,
    },
    {
      name: 'Companion Visit',
      slug: 'companion-visit',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Extended presence. Not task-based — simply being there. For isolated elders or those in recovery. Emotional maturity essential.',
      descriptionReceiver: 'Someone who simply sits with your loved one. Talks. Listens. Is present. No tasks — just human company.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 700,
      suggestedFeeMax: 1000,
      requiresVehicle: false,
      sortOrder: 3,
    },
    {
      name: 'Local Representative',
      slug: 'local-representative',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Ongoing eyes-and-ears for a family managing affairs from a distance. High reliability and communication required. Trust Level 3 only.',
      descriptionReceiver: 'Someone who represents your family locally for any matter — property, offices, errands. Your trusted local presence.',
      minTrustLevel: TrustLevel.LEVEL_3,
      suggestedFeeMin: 1000,
      suggestedFeeMax: 2000,
      requiresVehicle: false,
      sortOrder: 4,
    },
    {
      name: 'Event Assistance',
      slug: 'event-assist',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Accompany elder to weddings, funerals, religious events when family cannot attend. Social comfort and patience essential.',
      descriptionReceiver: 'Your parent attends the family event with a trusted companion by their side — so they are never alone.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 1000,
      suggestedFeeMax: 2500,
      requiresVehicle: false,
      sortOrder: 5,
    },

    // CLUSTER B — NAVIGATION
    {
      name: 'Hospital Guidance Help',
      slug: 'hospital-help',
      cluster: ServiceCluster.NAVIGATION,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Accompany to hospital. Help understand doctors, manage paperwork and queues. Half-day commitment typical. Patience essential.',
      descriptionReceiver: 'Someone who goes with your parent to the hospital — so they are never alone or confused.',
      minTrustLevel: TrustLevel.LEVEL_1,
      suggestedFeeMin: 800,
      suggestedFeeMax: 1200,
      requiresVehicle: false,
      sortOrder: 6,
    },
    {
      name: 'Document Help',
      slug: 'document-help',
      cluster: ServiceCluster.NAVIGATION,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Assist with form filling, photocopying, submitting applications. Basic literacy required.',
      descriptionReceiver: 'Someone who helps with any paperwork that feels overwhelming — forms, applications, submissions.',
      minTrustLevel: TrustLevel.LEVEL_1,
      suggestedFeeMin: 400,
      suggestedFeeMax: 700,
      requiresVehicle: false,
      sortOrder: 7,
    },
    {
      name: 'Bank Work Help',
      slug: 'bank-help',
      cluster: ServiceCluster.NAVIGATION,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Accompany to bank. Assist with transactions, passbook updates, FD renewals. Familiarity with banking helpful.',
      descriptionReceiver: 'Someone who goes to the bank with your parent — so they are not confused or alone in the queue.',
      minTrustLevel: TrustLevel.LEVEL_1,
      suggestedFeeMin: 400,
      suggestedFeeMax: 700,
      requiresVehicle: false,
      sortOrder: 8,
    },
    {
      name: 'Government Office Help',
      slug: 'govt-office',
      cluster: ServiceCluster.NAVIGATION,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Assist at municipal, ration, pension, Aadhaar offices. Knowledge of local government offices helpful.',
      descriptionReceiver: 'Someone who handles the government office visit — so your parent does not have to navigate it alone.',
      minTrustLevel: TrustLevel.LEVEL_1,
      suggestedFeeMin: 500,
      suggestedFeeMax: 800,
      requiresVehicle: false,
      sortOrder: 9,
    },
    {
      name: 'Property Visit Help',
      slug: 'property-visit',
      cluster: ServiceCluster.NAVIGATION,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Accompany for property site visits or represent family locally at property matters. Discretion essential.',
      descriptionReceiver: 'Someone who visits a property on your behalf or accompanies your parent for any property matter.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 800,
      suggestedFeeMax: 1500,
      requiresVehicle: false,
      sortOrder: 10,
    },

    // CLUSTER C — CONTINUITY
    {
      name: 'Medicine Pickup Help',
      slug: 'medicine-pickup',
      cluster: ServiceCluster.CONTINUITY,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Collect prescription medicines, verify dosage, deliver to home. Vehicle strongly recommended.',
      descriptionReceiver: 'Someone who collects medicines from the chemist and delivers them to your parent\'s door.',
      minTrustLevel: TrustLevel.LEVEL_1,
      suggestedFeeMin: 300,
      suggestedFeeMax: 500,
      requiresVehicle: true,
      sortOrder: 11,
    },
    {
      name: 'Travel Assistance',
      slug: 'travel-assist',
      cluster: ServiceCluster.CONTINUITY,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Accompany to airport or railway station. Help with boarding for elderly or unwell. Vehicle required.',
      descriptionReceiver: 'Someone who takes your parent safely to the airport or station and stays until they board.',
      minTrustLevel: TrustLevel.LEVEL_1,
      suggestedFeeMin: 1000,
      suggestedFeeMax: 2000,
      requiresVehicle: true,
      sortOrder: 12,
    },

    // CLUSTER D — CONNECTION
    {
      name: 'Talk / Emotional Support',
      slug: 'talk-support',
      cluster: ServiceCluster.CONNECTION,
      mode: ServiceMode.REMOTE,
      descriptionProvider: 'Scheduled voice or video conversation. Not therapy. Not advice. Just human presence that listens. Empathy and patience are everything here.',
      descriptionReceiver: 'A real human who listens. No judgment. No advice unless asked. Just presence — by voice or video.',
      minTrustLevel: TrustLevel.LEVEL_0,
      suggestedFeeMin: 250,
      suggestedFeeMax: 400,
      requiresVehicle: false,
      sortOrder: 13,
    },
    {
      name: 'Student Support — New City',
      slug: 'student-support',
      cluster: ServiceCluster.CONNECTION,
      mode: ServiceMode.BOTH,
      descriptionProvider: 'First-week anchor for students arriving somewhere alone. Local knowledge of Ahmedabad or Gandhinagar helpful.',
      descriptionReceiver: 'Someone who helps a student navigate a new city — accommodation, essentials, orientation, local guidance.',
      minTrustLevel: TrustLevel.LEVEL_0,
      suggestedFeeMin: 300,
      suggestedFeeMax: 600,
      requiresVehicle: false,
      sortOrder: 14,
    },
    {
      name: 'Grief Companion',
      slug: 'grief-companion',
      cluster: ServiceCluster.CONNECTION,
      mode: ServiceMode.BOTH,
      descriptionProvider: 'Presence during loss. Calm, non-judgmental human witness. Emotional maturity essential. Not a counsellor — just a caring presence.',
      descriptionReceiver: 'Someone who sits with you during a difficult time. No fixing. No advice. Just calm human presence.',
      minTrustLevel: TrustLevel.LEVEL_1,
      suggestedFeeMin: 400,
      suggestedFeeMax: 700,
      requiresVehicle: false,
      sortOrder: 15,
    },
    {
      name: 'First Contact / Needs Assessment',
      slug: 'needs-assessment',
      cluster: ServiceCluster.CONNECTION,
      mode: ServiceMode.BOTH,
      descriptionProvider: 'First conversation with a vulnerable person. Listen carefully, map what they actually need, recommend the right services. Our most trusted companions only — Trust Level 3.',
      descriptionReceiver: 'Not sure what you need? Talk to someone first. They will listen and help you figure out the right support.',
      minTrustLevel: TrustLevel.LEVEL_3,
      suggestedFeeMin: 200,
      suggestedFeeMax: 350,
      requiresVehicle: false,
      sortOrder: 16,
    },

    // ── Elder Healthcare Layer ────────────────────────
    {
      name: 'Basic Elder Care Companion',
      slug: 'basic-elder-care',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Be present with an elder who needs company and light assistance. Sit with them, converse, observe their wellbeing. No clinical tasks required. Warm presence and patience are everything.',
      descriptionReceiver: 'A trusted person who stays with your elder, keeps them company, and ensures they are not alone. Light assistance with daily activities.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 500,
      suggestedFeeMax: 800,
      requiresVehicle: false,
      sortOrder: 17,
    },
    {
      name: 'Personal Care Assistance',
      slug: 'personal-care',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Help an elder with bathing, dressing, grooming, and personal hygiene. Must be comfortable with physical care tasks and maintaining dignity at all times.',
      descriptionReceiver: 'Someone who helps your elder with their daily personal hygiene and grooming — with full respect for their dignity.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 600,
      suggestedFeeMax: 1000,
      requiresVehicle: false,
      sortOrder: 18,
    },
    {
      name: 'Diaper & Continence Care',
      slug: 'diaper-care',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Provide diaper changes and continence care for bedridden or mobility-impaired elders. Must be trained, non-judgmental, and dignified in approach.',
      descriptionReceiver: 'Professional, dignified continence care for your elder — handled with complete respect and care.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 700,
      suggestedFeeMax: 1200,
      requiresVehicle: false,
      sortOrder: 19,
    },
    {
      name: 'Medication Management',
      slug: 'medication-management',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Dispense prescribed medicines on schedule. Monitor and record intake. Follow written prescription only — never advise on changes. Medical background preferred.',
      descriptionReceiver: 'Someone who ensures your elder takes their medicines correctly and on time — every day, without fail.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 500,
      suggestedFeeMax: 800,
      requiresVehicle: false,
      sortOrder: 20,
    },
    {
      name: 'Bedridden Elder Care',
      slug: 'bedridden-care',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Full care for a bedridden elder — positioning, hygiene, feeding, wound observation, and companionship. Clinical experience required. Physical capability to assist with transfer essential.',
      descriptionReceiver: 'Comprehensive care for a bedridden elder — so they are clean, comfortable, fed, and not alone.',
      minTrustLevel: TrustLevel.LEVEL_3,
      suggestedFeeMin: 1000,
      suggestedFeeMax: 2000,
      requiresVehicle: false,
      sortOrder: 21,
    },
    {
      name: 'Day Shift Home Care',
      slug: 'day-shift-care',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Full day presence (6-8 hours) for an elder or recovering patient. Comprehensive personal care, companionship, and family support. Healthcare background preferred.',
      descriptionReceiver: 'A dedicated carer present through the day — so the working members of your family can focus without worry.',
      minTrustLevel: TrustLevel.LEVEL_2,
      suggestedFeeMin: 1500,
      suggestedFeeMax: 2500,
      requiresVehicle: false,
      sortOrder: 22,
    },
    {
      name: 'Night Shift Home Care',
      slug: 'night-shift-care',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Overnight presence for an elder who needs nighttime care or monitoring. Healthcare background required. High trust assignment — you are alone with the elder through the night.',
      descriptionReceiver: 'A trusted, verified carer present through the night — so your family can sleep knowing your elder is safe.',
      minTrustLevel: TrustLevel.LEVEL_3,
      suggestedFeeMin: 1500,
      suggestedFeeMax: 2500,
      requiresVehicle: false,
      sortOrder: 23,
    },
    {
      name: 'Live-in Care',
      slug: 'live-in-care',
      cluster: ServiceCluster.PRESENCE,
      mode: ServiceMode.IN_PERSON,
      descriptionProvider: 'Ongoing live-in companion for an elder who needs round-the-clock presence and care. This replaces what agencies provide — but you are verified, named, and accountable. Significant care experience required.',
      descriptionReceiver: 'A verified, named live-in companion for your elder — the accountable alternative to an anonymous agency. Weekly or monthly basis.',
      minTrustLevel: TrustLevel.LEVEL_3,
      suggestedFeeMin: 15000,
      suggestedFeeMax: 25000,
      requiresVehicle: false,
      sortOrder: 24,
    },
  ]

  for (const service of services) {
    await prisma.serviceCategory.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }
  console.log(`✓ ${services.length} service categories seeded`)
}

async function seedTestCompanion() {
  if (process.env.NODE_ENV !== 'development') return

  // Always run to ensure healthcare fields are up to date on Manjuben

  console.log('Seeding test companion (Manjuben Patel)...')

  // 1. User
  const user = await prisma.user.upsert({
    where: { phone: '9999900001' },
    update: {},
    create: {
      phone: '9999900001',
      name: 'Manjuben Patel',
      role: Role.COMPANION,
      city: 'Ahmedabad',
      accountStatus: AccountStatus.ACTIVE,
      isPhoneVerified: true,
      consentTerms: true,
      consentAbuse: true,
      consentData: true,
      consentNotif: true,
      consentAt: new Date(),
    },
  })

  // 2. ProviderProfile
  const healthcareFields = {
    hasHealthcareTraining: true,
    healthcareQualifications: ['HOME_CARE_TRAINING'],
    clinicalTasksOffered: ['BED_BATH', 'DIAPER_CHANGE', 'PATIENT_POSITIONING'],
    physicalCareCapable: true,
    comfortableWithFluids: true,
    preferredShifts: ['MORNING', 'FULL_DAY'],
  }
  const profile = await prisma.providerProfile.upsert({
    where: { userId: user.id },
    update: healthcareFields,
    create: {
      userId: user.id,
      legalName: 'Manjuben Patel',
      providerType: ProviderType.SOLO_COMPANION,
      applicationStage: ApplicationStage.APPROVED,
      trustLevel: TrustLevel.LEVEL_2,
      accountStatus: AccountStatus.ACTIVE,
      city: 'Ahmedabad',
      state: 'Gujarat',
      gender: Gender.FEMALE,
      currentStatus: 'HOMEMAKER',
      occupationCurrent: 'Homemaker',
      ageRange: '46-55',
      languages: ['Gujarati', 'Hindi'],
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableSlots: ['Morning'],
      serviceAreas: ['Navrangpura', 'Satellite', 'Bopal'],
      serviceRadiusKm: 10,
      hasVehicle: true,
      vehicleType: 'Two-wheeler',
      hardSkills: ['TWO_WHEELER_DRIVER'],
      softSkills: ['EMPATHETIC', 'PATIENT', 'WARM_PRESENCE'],
      totalSessions: 12,
      reliabilityScore: 95.0,
      activatedAt: new Date(),
      availableNow: true,
      ...healthcareFields,
    },
  })

  // 3. ServiceOfferings
  const serviceSlugMap = [
    {
      slug: 'elder-visit',
      experienceLevel: ExperienceLevel.SOME_EXPERIENCE,
      personalStatement:
        'I have been visiting elderly neighbours for years. I understand what they need — patience, good conversation, and someone who genuinely cares.',
    },
    {
      slug: 'medicine-pickup',
      experienceLevel: ExperienceLevel.CONFIDENT,
      personalStatement:
        'I know all the chemists in Navrangpura and Satellite. I can collect and verify medicines quickly.',
    },
    {
      slug: 'hospital-help',
      experienceLevel: ExperienceLevel.SOME_EXPERIENCE,
      personalStatement:
        'I have accompanied my own parents to hospital many times. I know how to handle paperwork and queues.',
    },
  ]

  for (const s of serviceSlugMap) {
    const category = await prisma.serviceCategory.findUnique({ where: { slug: s.slug } })
    if (!category) {
      console.warn(`  ⚠ Service category '${s.slug}' not found — skipping`)
      continue
    }
    await prisma.serviceOffering.upsert({
      where: { providerProfileId_serviceCategoryId: { providerProfileId: profile.id, serviceCategoryId: category.id } },
      update: {},
      create: {
        providerProfileId: profile.id,
        serviceCategoryId: category.id,
        experienceLevel: s.experienceLevel,
        personalStatement: s.personalStatement,
        isActive: true,
      },
    })
  }

  // 4. VerificationRecord
  await prisma.verificationRecord.upsert({
    where: { providerProfileId: profile.id },
    update: {},
    create: {
      providerProfileId: profile.id,
      aadhaarStatus: VerificationStatus.CONFIRMED,
      pccStatus: VerificationStatus.CONFIRMED,
      ref1Status: 'COMPLETED',
      ref2Status: 'COMPLETED',
      overallStatus: VerificationStatus.CONFIRMED,
    },
  })

  // 5. OrientationRecord
  await prisma.orientationRecord.upsert({
    where: { providerProfileId: profile.id },
    update: {},
    create: {
      providerProfileId: profile.id,
      module1Complete: true,
      module2Complete: true,
      module3Complete: true,
      module4Complete: true,
      module5Complete: true,
      module6Complete: true,
      quizScore: 88,
      quizPassedAt: new Date(),
      codeSignedAt: new Date(),
      completedAt: new Date(),
    },
  })

  console.log('✓ Test companion seeded: Manjuben Patel (Ahmedabad, LEVEL_2, ACTIVE)')
}

async function seedPlatformRate() {
  console.log('Seeding platform rate config...')

  const existing = await prisma.platformRateConfig.findFirst({ where: { isActive: true } })

  if (!existing) {
    await prisma.platformRateConfig.create({
      data: {
        companionSharePct: 80.0,
        platformSharePct: 20.0,
        reason: 'Initial platform rate — standard 80/20 split',
        effectiveFrom: new Date('2024-01-01'),
        announcedAt: new Date('2024-01-01'),
        announcedBy: 'system',
        noticeGivenDays: 0,
        previousRate: null,
        isActive: true,
      },
    })
    console.log('✓ Default platform rate config seeded (80/20)')
  } else {
    console.log('✓ Platform rate config already exists — skipped')
  }
}

main()
  .then(() => seedTestCompanion())
  .then(() => seedPlatformRate())
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
