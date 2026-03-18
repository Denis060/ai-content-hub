import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  if (!clientKey) {
    console.error('Missing TikTok Client Key')
    return NextResponse.json({ error: 'OAuth not configured correctly on server' }, { status: 500 })
  }

  // Generate a random state string to prevent CSRF attacks
  const state = Math.random().toString(36).substring(7)
  const cookieStore = cookies()
  cookieStore.set('tiktok_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  })

  // The base URL of our application, prioritizing Vercel's URL but falling back to localhost
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUri = encodeURIComponent(`${protocol}://${host}/api/auth/callback/tiktok`)

  // Construct TikTok Authorization URL
  const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=user.info.basic,video.upload&response_type=code&redirect_uri=${redirectUri}&state=${state}`

  return NextResponse.redirect(tiktokAuthUrl)
}
