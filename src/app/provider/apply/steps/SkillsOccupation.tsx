'use client'

import { useState } from 'react'
import type { ApplicationData } from '../types'

interface Props {
  data: ApplicationData
  setData: (update: Partial<ApplicationData>) => void
  onNext: () => void
  onBack: () => void
}

const STATUS_OPTIONS = [
  { value: 'EMPLOYED', label: 'Currently employed' },
  { value: 'SELF_EMPLOYED', label: 'Self-employed / freelance' },
  { value: 'HOMEMAKER', label: 'Homemaker' },
  { value: 'RETIRED', label: 'Retired' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'BETWEEN_JOBS', label: 'Between jobs / Taking a break' },
]

const AGE_RANGES = [
  { value: '18_25', label: '18–25' },
  { value: '26_35', label: '26–35' },
  { value: '36_45', label: '36–45' },
  { value: '46_55', label: '46–55' },
  { value: '56_65', label: '56–65' },
  { value: '66_plus', label: '66 and above' },
]

const HARD_SKILLS: { value: string; label: string }[] = [
  { value: 'FOUR_WHEELER_DRIVER', label: 'Can drive four-wheeler' },
  { value: 'TWO_WHEELER_DRIVER', label: 'Can drive two-wheeler' },
  { value: 'COMPUTER_LITERATE', label: 'Computer literate' },
  { value: 'MEDICAL_BACKGROUND', label: 'Medical background' },
  { value: 'LEGAL_KNOWLEDGE', label: 'Legal knowledge' },
  { value: 'FINANCIAL_LITERACY', label: 'Financial literacy' },
  { value: 'GOVT_OFFICE_NAVIGATION', label: 'Government office navigation' },
  { value: 'MULTILINGUAL', label: 'Multilingual' },
  { value: 'FIRST_AID_TRAINED', label: 'First aid trained' },
]

const SOFT_SKILLS: { value: string; label: string }[] = [
  { value: 'EMPATHETIC', label: 'Empathetic' },
  { value: 'PATIENT', label: 'Patient' },
  { value: 'GOOD_COMMUNICATOR', label: 'Good communicator' },
  { value: 'WARM_PRESENCE', label: 'Warm presence' },
  { value: 'EMOTIONALLY_MATURE', label: 'Emotionally mature' },
  { value: 'CULTURALLY_SENSITIVE', label: 'Culturally sensitive' },
  { value: 'CALM_UNDER_PRESSURE', label: 'Calm under pressure' },
  { value: 'TRUSTWORTHY', label: 'Trustworthy' },
  { value: 'RELIABLE', label: 'Reliable' },
]

const LANGUAGES = ['Gujarati', 'Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Other']

const HEALTHCARE_QUALIFICATIONS = [
  { value: 'ANM', label: 'ANM (Auxiliary Nurse Midwife)' },
  { value: 'GNM', label: 'GNM (General Nurse Midwife)' },
  { value: 'BSC_NURSING', label: 'BSc Nursing' },
  { value: 'BPHARM', label: 'Pharmacy (B.Pharm / D.Pharm)' },
  { value: 'PHYSIOTHERAPY', label: 'Physiotherapy (BPT/MPT)' },
  { value: 'MBBS', label: 'MBBS / Medical degree' },
  { value: 'NURSING_ASSISTANT', label: 'Nursing assistant training' },
  { value: 'FIRST_AID', label: 'First aid certified' },
  { value: 'HOME_CARE_TRAINING', label: 'Home care / elder care training' },
]

const CLINICAL_TASKS = [
  { value: 'BED_BATH', label: 'Bed bath / sponge bath' },
  { value: 'DIAPER_CHANGE', label: 'Diaper change / continence care' },
  { value: 'FEEDING', label: 'Feeding (oral)' },
  { value: 'MEDICATION_DISPENSING', label: 'Medication dispensing' },
  { value: 'VITAL_SIGNS', label: 'Checking vital signs' },
  { value: 'WOUND_DRESSING', label: 'Wound dressing (basic)' },
  { value: 'PATIENT_POSITIONING', label: 'Patient positioning / turning' },
  { value: 'TRANSFER_ASSIST', label: 'Transfer (bed to wheelchair)' },
  { value: 'OXYGEN_USE', label: 'Oxygen mask use' },
  { value: 'PHYSIO_EXERCISES', label: 'Physiotherapy exercises (basic)' },
]

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all"
      style={{
        border: checked ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
        background: checked ? '#F0F7F4' : '#FFFFFF',
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
      <div
        className="flex-shrink-0 rounded flex items-center justify-center"
        style={{
          width: 20, height: 20,
          background: checked ? '#4A8C6F' : '#FFFFFF',
          border: checked ? '2px solid #4A8C6F' : '2px solid #E8E0D8',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-[#1C2B3A]">{label}</span>
    </label>
  )
}

export default function SkillsOccupation({ data, setData, onNext }: Props) {
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  function toggleHardSkill(skill: string) {
    const current = data.hardSkills
    setData({ hardSkills: current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill] })
  }

  function toggleSoftSkill(skill: string) {
    const current = data.softSkills
    setData({ softSkills: current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill] })
  }

  function toggleLanguage(lang: string) {
    const current = data.languages
    setData({ languages: current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang] })
  }

  function toggleQualification(val: string) {
    const current = data.healthcareQualifications
    setData({ healthcareQualifications: current.includes(val) ? current.filter((v) => v !== val) : [...current, val] })
  }

  function toggleClinicalTask(val: string) {
    const current = data.clinicalTasksOffered
    setData({ clinicalTasksOffered: current.includes(val) ? current.filter((v) => v !== val) : [...current, val] })
  }

  function validate(): boolean {
    const e: Partial<Record<string, string>> = {}
    if (!data.currentStatus) e.currentStatus = 'Please select your current status'
    if (!data.ageRange) e.ageRange = 'Please select your age range'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validate()) onNext()
  }

  const showProfession = data.currentStatus === 'EMPLOYED' || data.currentStatus === 'SELF_EMPLOYED'
  const showRetired = data.currentStatus === 'RETIRED'
  const showStudent = data.currentStatus === 'STUDENT'

  const hasSomeTraining = data.healthcareTrainingLevel === 'FORMAL' || data.healthcareTrainingLevel === 'EXPERIENCE'
  const isFormally = data.healthcareTrainingLevel === 'FORMAL'
  const isExperienceOnly = data.healthcareTrainingLevel === 'EXPERIENCE'

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A6B7A] mb-1">
          Skills & Background
        </h2>
      </div>

      {/* Occupation */}
      <div className="bg-white rounded-2xl p-5 space-y-5" style={{ border: '1px solid #E8E0D8' }}>
        <h3 className="text-sm font-semibold text-[#1A6B7A]">Tell us about yourself</h3>

        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
            Current status <span className="text-[#E85D4A]">*</span>
          </label>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((opt) => {
              const active = data.currentStatus === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setData({ currentStatus: opt.value, occupationCurrent: '', occupationPast: '', studyField: '' })
                  }}
                  className="w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                    background: active ? '#F0F7F4' : '#FFFFFF',
                    color: active ? '#4A8C6F' : '#1C2B3A',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          {errors.currentStatus && <p className="text-xs text-[#E85D4A] mt-1">{errors.currentStatus}</p>}
        </div>

        {showProfession && (
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
              Your profession or field
            </label>
            <input
              type="text"
              value={data.occupationCurrent}
              onChange={(e) => setData({ occupationCurrent: e.target.value.slice(0, 60) })}
              placeholder="e.g. Nurse, Teacher, Social Worker"
              maxLength={60}
              className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
              style={{ border: '1.5px solid #E8E0D8' }}
            />
          </div>
        )}

        {showRetired && (
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
              What did you do before retiring?
            </label>
            <input
              type="text"
              value={data.occupationPast}
              onChange={(e) => setData({ occupationPast: e.target.value.slice(0, 60) })}
              placeholder="e.g. Government officer, Teacher"
              maxLength={60}
              className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
              style={{ border: '1.5px solid #E8E0D8' }}
            />
          </div>
        )}

        {showStudent && (
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
              What are you studying?
            </label>
            <input
              type="text"
              value={data.studyField}
              onChange={(e) => setData({ studyField: e.target.value.slice(0, 60) })}
              placeholder="e.g. Social Work, Psychology, Commerce"
              maxLength={60}
              className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
              style={{ border: '1.5px solid #E8E0D8' }}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
            Age range <span className="text-[#E85D4A]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {AGE_RANGES.map((ar) => {
              const active = data.ageRange === ar.value
              return (
                <button
                  key={ar.value}
                  type="button"
                  onClick={() => setData({ ageRange: ar.value })}
                  className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: active ? '#4A8C6F' : '#F9F5F0',
                    color: active ? '#FFFFFF' : '#6B7280',
                    border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                  }}
                >
                  {ar.label}
                </button>
              )
            })}
          </div>
          {errors.ageRange && <p className="text-xs text-[#E85D4A] mt-1">{errors.ageRange}</p>}
        </div>
      </div>

      {/* Healthcare Background */}
      <div className="bg-white rounded-2xl p-5 space-y-5" style={{ border: '1px solid #E8E0D8' }}>
        <div>
          <h3 className="text-sm font-semibold text-[#1A6B7A]">Healthcare Background</h3>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            NearDear companions increasingly assist with elder care. This helps us match the right people for the right services.
          </p>
        </div>

        {/* 1. Do you have healthcare training? */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
            Do you have healthcare training?
          </label>
          <div className="space-y-2">
            {([
              { value: 'FORMAL', label: 'Yes — formally trained', hint: 'Nursing, pharmacy, physiotherapy, etc.' },
              { value: 'EXPERIENCE', label: 'Yes — experience only', hint: 'Caring for a family member, patient, etc.' },
              { value: 'NONE', label: 'No healthcare training', hint: '' },
            ] as { value: 'FORMAL' | 'EXPERIENCE' | 'NONE'; label: string; hint: string }[]).map((opt) => {
              const active = data.healthcareTrainingLevel === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setData({
                      healthcareTrainingLevel: opt.value,
                      // clear sub-fields if switching to NONE
                      ...(opt.value === 'NONE' && {
                        healthcareQualifications: [],
                        clinicalTasksOffered: [],
                        healthcareExperienceNote: '',
                        physicalCareCapable: false,
                        comfortableWithFluids: false,
                        canLiftPatient: false,
                        canDoNightShift: false,
                        availableForLiveIn: false,
                      }),
                    })
                  }}
                  className="w-full text-left rounded-xl px-4 py-3 text-sm transition-all"
                  style={{
                    border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                    background: active ? '#F0F7F4' : '#FFFFFF',
                  }}
                >
                  <span className="font-semibold" style={{ color: active ? '#4A8C6F' : '#1C2B3A' }}>
                    {opt.label}
                  </span>
                  {opt.hint && (
                    <span className="block text-xs mt-0.5 text-[#9CA3AF]">{opt.hint}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Qualifications (shown if formally trained) */}
        {isFormally && (
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
              Your qualifications
            </label>
            <div className="space-y-2">
              {HEALTHCARE_QUALIFICATIONS.map((q) => (
                <CheckRow
                  key={q.value}
                  label={q.label}
                  checked={data.healthcareQualifications.includes(q.value)}
                  onChange={() => toggleQualification(q.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Clinical tasks (shown if any training) */}
        {hasSomeTraining && (
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
              Tasks you are comfortable with
            </label>
            <div className="space-y-2">
              {CLINICAL_TASKS.map((t) => (
                <CheckRow
                  key={t.value}
                  label={t.label}
                  checked={data.clinicalTasksOffered.includes(t.value)}
                  onChange={() => toggleClinicalTask(t.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. Physical care capacity (shown if any training) */}
        {hasSomeTraining && (
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
              Physical care capacity
            </label>
            <div className="space-y-2">
              {([
                { field: 'physicalCareCapable' as const, label: 'Comfortable with personal hygiene care' },
                { field: 'comfortableWithFluids' as const, label: 'Comfortable with bodily fluids' },
                { field: 'canLiftPatient' as const, label: 'Can lift / support adult patient' },
                { field: 'canDoNightShift' as const, label: 'Available for night shifts' },
                { field: 'availableForLiveIn' as const, label: 'Available for live-in assignments' },
              ]).map(({ field, label }) => (
                <CheckRow
                  key={field}
                  label={label}
                  checked={data[field]}
                  onChange={() => setData({ [field]: !data[field] })}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. Experience note (shown if experience only) */}
        {isExperienceOnly && (
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
              Tell us about your care experience
            </label>
            <textarea
              value={data.healthcareExperienceNote}
              onChange={(e) => setData({ healthcareExperienceNote: e.target.value.slice(0, 150) })}
              placeholder={'e.g. Cared for my bedridden mother-in-law for 2 years. Experienced with bathing, diaper change, and feeding.'}
              rows={3}
              maxLength={150}
              className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F] resize-none"
              style={{ border: '1.5px solid #E8E0D8' }}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {data.healthcareExperienceNote.length}/150
            </p>
          </div>
        )}
      </div>

      {/* Hard Skills */}
      <div className="bg-white rounded-2xl p-5 space-y-3" style={{ border: '1px solid #E8E0D8' }}>
        <h3 className="text-sm font-semibold text-[#1A6B7A]">Practical skills</h3>
        <p className="text-xs text-[#9CA3AF]">Select all that apply</p>
        <div className="space-y-2">
          {HARD_SKILLS.map((skill) => {
            const active = data.hardSkills.includes(skill.value)
            return (
              <label
                key={skill.value}
                className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all"
                style={{
                  border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                  background: active ? '#F0F7F4' : '#FFFFFF',
                }}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleHardSkill(skill.value)}
                  className="hidden"
                />
                <div
                  className="flex-shrink-0 rounded flex items-center justify-center"
                  style={{
                    width: 20, height: 20,
                    background: active ? '#4A8C6F' : '#FFFFFF',
                    border: active ? '2px solid #4A8C6F' : '2px solid #E8E0D8',
                  }}
                >
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#1C2B3A]">{skill.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="bg-white rounded-2xl p-5 space-y-3" style={{ border: '1px solid #E8E0D8' }}>
        <h3 className="text-sm font-semibold text-[#1A6B7A]">Personal qualities</h3>
        <p className="text-xs text-[#9CA3AF]">Select all that apply</p>
        <div className="space-y-2">
          {SOFT_SKILLS.map((skill) => {
            const active = data.softSkills.includes(skill.value)
            return (
              <label
                key={skill.value}
                className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all"
                style={{
                  border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                  background: active ? '#F0F7F4' : '#FFFFFF',
                }}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleSoftSkill(skill.value)}
                  className="hidden"
                />
                <div
                  className="flex-shrink-0 rounded flex items-center justify-center"
                  style={{
                    width: 20, height: 20,
                    background: active ? '#4A8C6F' : '#FFFFFF',
                    border: active ? '2px solid #4A8C6F' : '2px solid #E8E0D8',
                  }}
                >
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#1C2B3A]">{skill.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-2xl p-5 space-y-3" style={{ border: '1px solid #E8E0D8' }}>
        <h3 className="text-sm font-semibold text-[#1A6B7A]">Languages you speak</h3>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const active = data.languages.includes(lang)
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                style={{
                  background: active ? '#4A8C6F' : '#F9F5F0',
                  color: active ? '#FFFFFF' : '#6B7280',
                  border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                }}
              >
                {lang}
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full rounded-xl py-4 text-white font-semibold text-base transition-opacity hover:opacity-90"
        style={{ background: '#4A8C6F' }}
      >
        Continue
      </button>
    </div>
  )
}
