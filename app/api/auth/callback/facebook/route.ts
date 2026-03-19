import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${new URL(request.url).origin}/connections?error=${error}`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${new URL(request.url).origin}/connections?error=missing_parameters`)
  }

  const cookieStore = cookies()
  const savedState = cookieStore.get('facebook_oauth_state')?.value

  if (state !== savedState) {
    return NextResponse.redirect(`${new URL(request.url).origin}/connections?error=invalid_state`)
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${new URL(request.url).origin}/connections?error=server_misconfigured`)
  }

  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUri = `${protocol}://${host}/api/auth/callback/facebook`

  try {
    // 1. Exchange 'code' for short-lived access token
    const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${code}`)
    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('Facebook Token Error:', tokenData)
      return NextResponse.redirect(`${new URL(request.url).origin}/connections?error=token_exchange_failed`)
    }

    // 2. Exchange the short-lived token for a long-lived token (usually 60 days)
    const longLivedResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${tokenData.access_token}`)
    const longLivedData = await longLivedResponse.json()
    
    const accessToken = longLivedData.access_token || tokenData.access_token
    const expiresIn = longLivedData.expires_in || tokenData.expires_in || 5184000 // default 60 days

    // 3. Fetch user profile info
    const meResponse = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,picture&access_token=${accessToken}`)
    const meData = await meResponse.json()

    if (!meData.id) {
       return NextResponse.redirect(`${new URL(request.url).origin}/connections?error=profile_fetch_failed`)
    }

    const { id: fbUserId, name: fbName, picture } = meData
    const avatarUrl = picture?.data?.url || ''

    // 4. Save to Supabase securely
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.redirect(`${new URL(request.url).origin}/login?error=unauthorized`)
    }

    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    // 5. One Meta token securely grants operations to both Facebook Pages and linked Instagram accounts. 
    // We visually save it as both connected platforms in the database.
    
    // Save Facebook connection
    await supabase.from('platform_accounts').upsert({
        user_id: user.id,
        platform: 'facebook',
        access_token: accessToken,
        refresh_token: null, // Facebook utilizes long-lived access tokens over refresh tokens
        platform_user_id: fbUserId.toString(),
        account_name: fbName,
        avatar_url: avatarUrl,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,platform' })

    // Save Instagram connection
    await supabase.from('platform_accounts').upsert({
        user_id: user.id,
        platform: 'instagram',
        access_token: accessToken,
        refresh_token: null,
        platform_user_id: fbUserId.toString(),
        account_name: fbName + ' (Instagram)',
        avatar_url: avatarUrl,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,platform' })

    return NextResponse.redirect(`${new URL(request.url).origin}/connections`)
  } catch (err) {
    console.error('Facebook OAuth caught error:', err)
    return NextResponse.redirect(`${new URL(request.url).origin}/connections?error=internal_server_error`)
  }
}
