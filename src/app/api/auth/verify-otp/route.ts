import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const rawPhone = (body as Record<string, unknown>).phone
  const otp = (body as Record<string, unknown>).otp

  if (typeof rawPhone !== 'string' || typeof otp !== 'string') {
    return NextResponse.json(
      { error: 'Phone and OTP are required' },
      { status: 400 }
    )
  }

  // Strip +91 prefix if present
  const phone = rawPhone.replace(/^\+91/, '').replace(/\s/g, '')

  // Find a valid, unused, non-expired OTP token
  const tokenRecord = await prisma.otpToken.findFirst({
    where: {
      phone,
      token: otp,
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
  })

  if (!tokenRecord) {
    return NextResponse.json(
      { error: 'Invalid or expired OTP' },
      { status: 401 }
    )
  }

  // Mark token as used
  await prisma.otpToken.update({
    where: { id: tokenRecord.id },
    data: { usedAt: new Date() },
  })

  // Find or create user and update lastLoginAt
  const user = await prisma.user.upsert({
    where: { phone },
    update: { lastLoginAt: new Date() },
    create: {
      phone,
      name: phone,
      city: 'Unknown',
      role: 'RECEIVER',
      accountStatus: 'ACTIVE',
      preferredLanguage: 'EN',
    },
  })

  return NextResponse.json({
    success: true,
    userId: user.id,
    role: user.role,
  })
}
