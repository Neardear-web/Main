import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      accountStatus: string
      phone?: string
    } & DefaultSession['user']
  }
}
