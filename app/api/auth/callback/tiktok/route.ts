import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const state = requestUrl.searchParams.get('state')
  const error = requestUrl.searchParams.get('error')

  // Handle user denying authorization
  if (error || !code) {
    return NextResponse.redirect(new URL('/connections?error=tiktok_rejected', request.url))
  }

  // Validate state
  const cookieStore = cookies()
  const savedState = cookieStore.get('tiktok_oauth_state')?.value
  
  if (!state || state !== savedState) {
    return NextResponse.redirect(new URL('/connections?error=invalid_state', request.url))
  }

  // Clear state cookie
  cookieStore.delete('tiktok_oauth_state')

  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET

  if (!clientKey || !clientSecret) {
    return NextResponse.redirect(new URL('/connections?error=missing_credentials', request.url))
  }

  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUri = `${protocol}://${host}/api/auth/callback/tiktok`

  try {
    // 1. Exchange custom auth code for access token via TikTok Open API v2
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      console.error('TikTok Token Error:', tokenData)
      return NextResponse.redirect(new URL('/connections?error=tiktok_token_failed', request.url))
    }

    const { access_token, refresh_token, open_id, expires_in } = tokenData

    // 2. Fetch User Info from TikTok API 
    const userRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
    
    const userInfo = await userRes.json()
    const accountName = userInfo.data?.user?.display_name || 'TikTok Account'

    // 3. Ensure user is actually logged in to our app
    const supabase = createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.redirect(new URL('/login?error=not_logged_in', request.url))
    }

    // 4. Save permanently to custom platform_accounts table
    const payload = {
        user_id: session.user.id,
        platform: 'tiktok',
        account_name: accountName,
        access_token: access_token,
        refresh_token: refresh_token || '',
        platform_user_id: open_id || '',
        expires_at: new Date(Date.now() + (expires_in || 86400) * 1000).toISOString()
    }

    const { data: existing } = await supabase
      .from('platform_accounts')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('platform', 'tiktok')
      .single()

    if (existing) {
      await supabase.from('platform_accounts').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('platform_accounts').insert(payload)
    }

    // Success! Drop them back to the connections dashboard
    return NextResponse.redirect(new URL('/connections', request.url))

  } catch (err: any) {
    console.error('TikTok OAuth Exception:', err)
    return NextResponse.redirect(new URL('/connections?error=tiktok_exception', request.url))
  }
}
