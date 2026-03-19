import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const clientId = process.env.FACEBOOK_CLIENT_ID
  if (!clientId) {
    console.error('Missing Facebook App ID')
    return NextResponse.json({ error: 'OAuth not configured correctly on server' }, { status: 500 })
  }

  // Generate a random state string to prevent CSRF attacks
  const state = Math.random().toString(36).substring(7)
  const cookieStore = cookies()
  cookieStore.set('facebook_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  })

  // The base URL of our application
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUri = encodeURIComponent(`${protocol}://${host}/api/auth/callback/facebook`)

  // Meta permissions required to post videos to Facebook Pages
  const scope = encodeURIComponent('email,public_profile,pages_show_list,pages_manage_posts,pages_read_engagement')

  // Construct Facebook Authorization URL
  const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&response_type=code`

  return NextResponse.redirect(facebookAuthUrl)
}
