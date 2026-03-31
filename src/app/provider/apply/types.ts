export type ApplicationStep =
  | 'INTEREST'
  | 'IDENTITY'
  | 'POLICE'
  | 'REFERENCES'
  | 'SERVICES'
  | 'AVAILABILITY'
  | 'SKILLS'
  | 'DECLARATION'
  | 'SUBMITTED'

export interface ServiceSelection {
  serviceCategoryId: string
  experienceLevel: 'FIRST_TIME' | 'SOME_EXPERIENCE' | 'CONFIDENT'
  personalStatement: string
}

export interface Reference {
  name: string
  phone: string
  relationship: string
  yearsKnown: string
}

export interface ApplicationData {
  // Step 1 — Interest
  legalName: string
  phone: string
  email: string
  city: string
  providerType: 'SOLO_COMPANION' | 'TEAM_OPERATOR' | 'PROFESSIONAL_ADVISOR'
  whyThisWork: string

  // Step 2 — Identity
  aadhaarNumber: string  // never stored in DB — only last 4 digits
  selfieUrl: string
  addressLine1: string
  addressLine2: string
  state: string
  pincode: string
  addressProofUrl: string
  alternatePhone: string
  yearsAtAddress: string

  // Step 3 — Police
  pccUrl: string
  pccIssuingAuth: string
  pccIssuedAt: string
  pccPending: boolean

  // Step 4 — References
  reference1: Reference
  reference2: Reference

  // Step 5 — Services
  selectedServices: ServiceSelection[]

  // Step 6 — Availability
  availableDays: string[]
  availableSlots: string[]
  weeklyHours: string
  noticePeriod: string
  serviceAreas: string
  serviceRadiusKm: number
  willingToTravel: boolean
  hasVehicle: boolean
  vehicleType: string

  // Step 7 — Skills
  currentStatus: string
  occupationCurrent: string
  occupationPast: string
  studyField: string
  ageRange: string
  hardSkills: string[]
  softSkills: string[]
  languages: string[]
  // Healthcare background
  healthcareTrainingLevel: '' | 'FORMAL' | 'EXPERIENCE' | 'NONE'
  healthcareQualifications: string[]
  clinicalTasksOffered: string[]
  physicalCareCapable: boolean
  comfortableWithFluids: boolean
  canLiftPatient: boolean
  canDoNightShift: boolean
  availableForLiveIn: boolean
  healthcareExperienceNote: string

  // Step 8 — Declaration
  consentCodeOfConduct: boolean
  consentHardRules: boolean
  consentViolations: boolean
  consentAccuracy: boolean
  consentVerification: boolean
  digitalSignature: string
}

export const DEFAULT_APPLICATION: ApplicationData = {
  legalName: '', phone: '', email: '', city: '', providerType: 'SOLO_COMPANION', whyThisWork: '',
  aadhaarNumber: '', selfieUrl: '', addressLine1: '', addressLine2: '', state: '', pincode: '',
  addressProofUrl: '', alternatePhone: '', yearsAtAddress: '',
  pccUrl: '', pccIssuingAuth: '', pccIssuedAt: '', pccPending: false,
  reference1: { name: '', phone: '', relationship: '', yearsKnown: '' },
  reference2: { name: '', phone: '', relationship: '', yearsKnown: '' },
  selectedServices: [],
  availableDays: [], availableSlots: [], weeklyHours: '', noticePeriod: '',
  serviceAreas: '', serviceRadiusKm: 10, willingToTravel: false,
  hasVehicle: false, vehicleType: '',
  currentStatus: '', occupationCurrent: '', occupationPast: '', studyField: '', ageRange: '',
  hardSkills: [], softSkills: [], languages: [],
  healthcareTrainingLevel: '', healthcareQualifications: [], clinicalTasksOffered: [],
  physicalCareCapable: false, comfortableWithFluids: false, canLiftPatient: false,
  canDoNightShift: false, availableForLiveIn: false, healthcareExperienceNote: '',
  consentCodeOfConduct: false, consentHardRules: false, consentViolations: false,
  consentAccuracy: false, consentVerification: false, digitalSignature: '',
}
