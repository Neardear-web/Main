import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string | undefined
        const otp = credentials?.otp as string | undefined

        if (!phone || !otp) return null

        // Find a valid OTP token
        const tokenRecord = await prisma.otpToken.findFirst({
          where: {
            phone,
            token: otp,
            expiresAt: { gt: new Date() },
            usedAt: null,
          },
        })

        if (!tokenRecord) return null

        // Mark token as used
        await prisma.otpToken.update({
          where: { id: tokenRecord.id },
          data: { usedAt: new Date() },
        })

        // Find or create the user
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

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          phone: user.phone,
          role: user.role,
          accountStatus: user.accountStatus,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = (user as { phone?: string }).phone
        token.role = (user as { role?: string }).role
        token.accountStatus = (user as { accountStatus?: string }).accountStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string
        session.user.role = token.role as string
        session.user.accountStatus = token.accountStatus as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
