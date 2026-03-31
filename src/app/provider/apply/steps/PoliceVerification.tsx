'use client'

import { useState, useRef } from 'react'
import type { ApplicationData } from '../types'

interface Props {
  data: ApplicationData
  setData: (update: Partial<ApplicationData>) => void
  onNext: () => void
  onBack: () => void
}

export default function PoliceVerification({ data, setData, onNext }: Props) {
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function uploadPcc(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, pccUrl: 'File must be under 5MB' }))
      return
    }
    setUploading(true)
    try {
      const res = await fetch('/api/upload/signed-url?type=pcc')
      const { uploadUrl, publicUrl } = await res.json() as { uploadUrl: string; publicUrl: string }
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      setData({ pccUrl: publicUrl })
      setErrors((prev) => ({ ...prev, pccUrl: undefined }))
    } catch {
      setErrors((prev) => ({ ...prev, pccUrl: 'Upload failed. Please try again.' }))
    } finally {
      setUploading(false)
    }
  }

  function validate(): boolean {
    const e: Partial<Record<string, string>> = {}
    if (!data.pccPending) {
      if (!data.pccUrl) e.pccUrl = 'Please upload your Police Clearance Certificate'
      if (!data.pccIssuingAuth.trim()) e.pccIssuingAuth = 'Please enter the issuing police station'
      if (!data.pccIssuedAt) {
        e.pccIssuedAt = 'Please enter the date of issue'
      } else {
        const issued = new Date(data.pccIssuedAt)
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
        if (issued < twelveMonthsAgo) {
          e.pccIssuedAt = 'PCC must be issued within the last 12 months. Please obtain a fresh certificate.'
        }
      }
    }
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
          Police Verification
        </h2>
      </div>

      {/* Info card */}
      <div
        className="rounded-xl p-4 space-y-2"
        style={{ background: '#F0F7F9', borderLeft: '4px solid #1A6B7A' }}
      >
        <p className="text-sm font-semibold text-[#1A6B7A]">
          A Police Clearance Certificate (PCC) is required for all NearDear companions.
        </p>
        <div className="text-xs text-[#6B7280] space-y-1">
          <p className="font-semibold text-[#1C2B3A]">How to get one:</p>
          <p>1. Visit your nearest police station</p>
          <p>2. Ask for a Character Certificate or Police Clearance Certificate</p>
          <p>3. It usually takes 3–7 days</p>
          <p>4. It costs ₹50–200 depending on state</p>
        </div>
      </div>

      {/* Toggle */}
      <div className="bg-white rounded-2xl p-1 flex" style={{ border: '1px solid #E8E0D8' }}>
        <button
          type="button"
          onClick={() => setData({ pccPending: false })}
          className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all"
          style={{
            background: !data.pccPending ? '#4A8C6F' : 'transparent',
            color: !data.pccPending ? '#FFFFFF' : '#6B7280',
          }}
        >
          I have my PCC
        </button>
        <button
          type="button"
          onClick={() => setData({ pccPending: true })}
          className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all"
          style={{
            background: data.pccPending ? '#4A8C6F' : 'transparent',
            color: data.pccPending ? '#FFFFFF' : '#6B7280',
          }}
        >
          I don&#39;t have it yet
        </button>
      </div>

      {data.pccPending ? (
        /* No PCC */
        <div
          className="rounded-xl p-5 text-center space-y-2"
          style={{ background: '#F0F7F4', border: '1px solid #4A8C6F' }}
        >
          <p className="text-sm font-semibold text-[#4A8C6F]">No problem.</p>
          <p className="text-sm text-[#1C2B3A]">
            You can upload it after submitting your application. Your application will be reviewed once we receive your PCC.
          </p>
          <p className="text-xs text-[#6B7280]">We will send you a reminder.</p>
        </div>
      ) : (
        /* Has PCC */
        <div className="bg-white rounded-2xl p-5 space-y-4" style={{ border: '1px solid #E8E0D8' }}>
          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
              Upload your PCC <span className="text-[#E85D4A]">*</span>
            </label>
            <p className="text-xs text-[#9CA3AF] mb-2">JPG, PNG, or PDF. Max 5MB.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) uploadPcc(file)
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-xl py-3 text-sm font-semibold text-[#4A8C6F] transition-opacity disabled:opacity-50"
              style={{ border: '1.5px solid #4A8C6F' }}
            >
              {uploading ? 'Uploading...' : data.pccUrl ? 'Replace PCC' : 'Choose File'}
            </button>
            {data.pccUrl && (
              <p className="text-xs text-[#4A8C6F] mt-1">PCC uploaded successfully</p>
            )}
            {errors.pccUrl && <p className="text-xs text-[#E85D4A] mt-1">{errors.pccUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
              Issuing police station / district <span className="text-[#E85D4A]">*</span>
            </label>
            <input
              type="text"
              value={data.pccIssuingAuth}
              onChange={(e) => setData({ pccIssuingAuth: e.target.value })}
              placeholder="e.g. Navrangpura Police Station, Ahmedabad"
              className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F]"
              style={{ border: errors.pccIssuingAuth ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
            />
            {errors.pccIssuingAuth && <p className="text-xs text-[#E85D4A] mt-1">{errors.pccIssuingAuth}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1C2B3A] mb-1">
              Date of issue <span className="text-[#E85D4A]">*</span>
            </label>
            <input
              type="date"
              value={data.pccIssuedAt}
              onChange={(e) => setData({ pccIssuedAt: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl px-4 py-3 text-[#1C2B3A] text-sm outline-none focus:ring-2 focus:ring-[#4A8C6F] bg-white"
              style={{ border: errors.pccIssuedAt ? '1.5px solid #E85D4A' : '1.5px solid #E8E0D8' }}
            />
            {errors.pccIssuedAt && <p className="text-xs text-[#E85D4A] mt-1">{errors.pccIssuedAt}</p>}
          </div>
        </div>
      )}

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
