import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const protectedPaths = [
  '/dashboard',
  '/request',
  '/session',
  '/elder',
  '/payments',
  '/settings',
  '/provider',
]

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
