export type Step = 'WHO' | 'ELDER_PROFILE' | 'WHAT_NEEDED' | 'WHEN' | 'REVIEW' | 'MATCHES'

export interface FlowData {
  whoNeedsHelp: 'MYSELF' | 'PARENT' | 'SOMEONE_ELSE' | null
  // Elder profile
  elderName: string
  elderCity: string
  elderPhone: string
  elderAgeRange: string
  elderPrimaryLanguage: string
  elderHealthNotes: string
  emergencyContactName: string
  emergencyContactPhone: string
  genderPreference: 'FEMALE' | 'MALE' | 'NO_PREFERENCE'
  // Elder care needs
  elderMobilityLevel: string
  elderPersonalCareNeeds: string[]
  elderMedicalEquipment: string[]
  elderCareHoursPerDay: string
  elderCareFrequency: string
  // What needed
  descriptionRaw: string
  selectedServiceIds: string[]
  notSureSelected: boolean
  // When
  timingType: 'SPECIFIC_DATE' | 'THIS_WEEK' | 'RECURRING' | null
  preferredDate: string
  preferredTimeSlot: string
  isRecurring: boolean
  recurringFreq: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | null
  recurringDays: string[]
}

export const DEFAULT_FLOW_DATA: FlowData = {
  whoNeedsHelp: null,
  elderName: '',
  elderCity: '',
  elderPhone: '',
  elderAgeRange: '',
  elderPrimaryLanguage: '',
  elderHealthNotes: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  genderPreference: 'NO_PREFERENCE',
  elderMobilityLevel: '',
  elderPersonalCareNeeds: [],
  elderMedicalEquipment: [],
  elderCareHoursPerDay: '',
  elderCareFrequency: '',
  descriptionRaw: '',
  selectedServiceIds: [],
  notSureSelected: false,
  timingType: null,
  preferredDate: '',
  preferredTimeSlot: '',
  isRecurring: false,
  recurringFreq: null,
  recurringDays: [],
}
