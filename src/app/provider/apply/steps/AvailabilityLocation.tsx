'use client'

import { useState } from 'react'
import type { ApplicationData } from '../types'

interface Props {
  data: ApplicationData
  setData: (update: Partial<ApplicationData>) => void
  onNext: () => void
  onBack: () => void
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_VALUES = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const TIME_SLOTS = [
  { value: 'MORNING', label: 'Morning', sub: '7am–12pm' },
  { value: 'AFTERNOON', label: 'Afternoon', sub: '12pm–5pm' },
  { value: 'EVENING', label: 'Evening', sub: '5pm–9pm' },
  { value: 'FLEXIBLE', label: 'Flexible', sub: 'Any time' },
]

const WEEKLY_HOURS_OPTIONS = [
  { value: '5_10', label: '5–10 hours/week' },
  { value: '10_20', label: '10–20 hours/week' },
  { value: '20_30', label: '20–30 hours/week' },
  { value: 'FULL_TIME', label: 'Full time (30+ hours)' },
]

const NOTICE_PERIOD_OPTIONS = [
  { value: 'SAME_DAY', label: 'Same day' },
  { value: '24_HOURS', label: '24 hours' },
  { value: '48_HOURS', label: '48 hours' },
  { value: '1_WEEK', label: '1 week' },
]

const RADIUS_OPTIONS = [
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 15, label: '15 km' },
  { value: 20, label: '20 km' },
  { value: 30, label: '30 km' },
]

const VEHICLE_TYPES = [
  { value: 'TWO_WHEELER', label: 'Two-wheeler' },
  { value: 'FOUR_WHEELER', label: 'Four-wheeler' },
  { value: 'BOTH', label: 'Both' },
]

export default function AvailabilityLocation({ data, setData, onNext }: Props) {
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  function toggleDay(dayValue: string) {
    const current = data.availableDays
    if (current.includes(dayValue)) {
      setData({ availableDays: current.filter((d) => d !== dayValue) })
    } else {
      setData({ availableDays: [...current, dayValue] })
    }
  }

  function toggleSlot(slotValue: string) {
    const current = data.availableSlots
    if (current.includes(slotValue)) {
      setData({ availableSlots: current.filter((s) => s !== slotValue) })
    } else {
      setData({ availableSlots: [...current, slotValue] })
    }
  }

  function validate(): boolean {
    const e: Partial<Record<string, string>> = {}
    if (data.availableDays.length === 0) e.availableDays = 'Please select at least one available day'
    if (data.availableSlots.length === 0) e.availableSlots = 'Please select at least one time slot'
    if (!data.weeklyHours) e.weeklyHours = 'Please select your weekly hours'
    if (!data.noticePeriod) e.noticePeriod = 'Please select your notice period'
    if (!data.serviceAreas.trim()) e.serviceAreas = 'Please enter the areas you can serve'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validate()) onNext()
  }

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A6B7A] mb-1">
          Availability & Location
        </h2>
        <p className="text-sm text-[#6B7280]">Tell us when and where you can work.</p>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-2xl p-5 space-y-5" style={{ border: '1px solid #E8E0D8' }}>
        <h3 className="text-sm font-semibold text-[#1A6B7A]">Availability</h3>

        {/* Days */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
            Available days <span className="text-[#E85D4A]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day, i) => {
              const val = DAY_VALUES[i]
              const active = data.availableDays.includes(val)
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggleDay(val)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: active ? '#4A8C6F' : '#F9F5F0',
                    color: active ? '#FFFFFF' : '#6B7280',
                    border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                  }}
                >
                  {day}
                </button>
              )
            })}
          </div>
          {errors.availableDays && <p className="text-xs text-[#E85D4A] mt-1">{errors.availableDays}</p>}
        </div>

        {/* Time Slots */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">
            Time slots <span className="text-[#E85D4A]">*</span>
          </label>
          <div className="space-y-2">
            {TIME_SLOTS.map((slot) => {
              const active = data.availableSlots.includes(slot.value)
              return (
                <label
                  key={slot.value}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all"
                  style={{
                    border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                    background: active ? '#F0F7F4' : '#FFFFFF',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleSlot(slot.value)}
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
                  <div>
                    <p className="text-sm font-semibold text-[#1C2B3A]">{slot.label}</p>
                    <p className="text-xs text-[#9CA3AF]">{slot.sub}</p>
                  </div>
                </label>
              )
            })}
          </div>
          {errors.availableSlots && <p className="text-xs text-[#E85D4A] mt-1">{errors.availableSlots}</p>}
        </div>

        {/* Weekly hours */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
            Weekly availability <span className="text-[#E85D4A]">*</span>
          </label>
          <select
            value={data.weeklyHours}
            onChange={(e) => setData({ weeklyHours: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F] bg-white"
            style={{ border: errors.weeklyHours ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
          >
            <option value="">Select weekly hours</option>
            {WEEKLY_HOURS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.weeklyHours && <p className="text-xs text-[#E85D4A] mt-1">{errors.weeklyHours}</p>}
        </div>

        {/* Notice period */}
        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
            How much notice do you need? <span className="text-[#E85D4A]">*</span>
          </label>
          <select
            value={data.noticePeriod}
            onChange={(e) => setData({ noticePeriod: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F] bg-white"
            style={{ border: errors.noticePeriod ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
          >
            <option value="">Select notice period</option>
            {NOTICE_PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.noticePeriod && <p className="text-xs text-[#E85D4A] mt-1">{errors.noticePeriod}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl p-5 space-y-4" style={{ border: '1px solid #E8E0D8' }}>
        <h3 className="text-sm font-semibold text-[#1A6B7A]">Location</h3>

        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
            Service areas <span className="text-[#E85D4A]">*</span>
          </label>
          <input
            type="text"
            value={data.serviceAreas}
            onChange={(e) => setData({ serviceAreas: e.target.value })}
            placeholder="e.g. Navrangpura, Satellite, Bopal, Thaltej, Maninagar"
            className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
            style={{ border: errors.serviceAreas ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
          />
          <p className="text-xs text-[#9CA3AF] mt-1">Comma-separated areas within your city</p>
          {errors.serviceAreas && <p className="text-xs text-[#E85D4A] mt-1">{errors.serviceAreas}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">Service radius</label>
          <select
            value={data.serviceRadiusKm}
            onChange={(e) => setData({ serviceRadiusKm: Number(e.target.value) })}
            className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F] bg-white"
            style={{ border: '1.5px solid #E8E0D8' }}
          >
            {RADIUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setData({ willingToTravel: !data.willingToTravel })}
              className="relative flex-shrink-0 cursor-pointer"
              style={{ width: 44, height: 24 }}
            >
              <div
                className="absolute inset-0 rounded-full transition-colors"
                style={{ background: data.willingToTravel ? '#4A8C6F' : '#E8E0D8' }}
              />
              <div
                className="absolute top-1 transition-all duration-200 rounded-full bg-white"
                style={{
                  width: 16, height: 16,
                  left: data.willingToTravel ? 24 : 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </div>
            <span className="text-sm text-[#1C2B3A]">Willing to travel beyond my radius for the right request</span>
          </label>
        </div>
      </div>

      {/* Vehicle */}
      <div className="bg-white rounded-2xl p-5 space-y-4" style={{ border: '1px solid #E8E0D8' }}>
        <h3 className="text-sm font-semibold text-[#1A6B7A]">Vehicle</h3>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setData({ hasVehicle: !data.hasVehicle, vehicleType: '' })}
              className="relative flex-shrink-0 cursor-pointer"
              style={{ width: 44, height: 24 }}
            >
              <div
                className="absolute inset-0 rounded-full transition-colors"
                style={{ background: data.hasVehicle ? '#4A8C6F' : '#E8E0D8' }}
              />
              <div
                className="absolute top-1 transition-all duration-200 rounded-full bg-white"
                style={{
                  width: 16, height: 16,
                  left: data.hasVehicle ? 24 : 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </div>
            <span className="text-sm text-[#1C2B3A]">I have my own vehicle</span>
          </label>
        </div>

        {data.hasVehicle && (
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-2">Vehicle type</label>
            <div className="space-y-2">
              {VEHICLE_TYPES.map((vt) => {
                const active = data.vehicleType === vt.value
                return (
                  <button
                    key={vt.value}
                    type="button"
                    onClick={() => setData({ vehicleType: vt.value })}
                    className="w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                    style={{
                      border: active ? '1.5px solid #4A8C6F' : '1.5px solid #E8E0D8',
                      background: active ? '#F0F7F4' : '#FFFFFF',
                      color: active ? '#4A8C6F' : '#1C2B3A',
                    }}
                  >
                    {vt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
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
