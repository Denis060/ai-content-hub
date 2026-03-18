import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/connections'
  
  if (code) {
    const supabase = createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/connections?error=auth', request.url))
    }

    // Sync Google OAuth Token to the database so the frontend UI recognizes the connection!
    if (session && session.user) {
      const googleIdentity = session.user.identities?.find(id => id.provider === 'google')
      if (googleIdentity) {
        const { data: existing } = await supabase
          .from('platform_accounts')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('platform', 'youtube')
          .single()
          
        const accountPayload = {
            user_id: session.user.id,
            platform: 'youtube',
            account_name: googleIdentity.identity_data?.name || googleIdentity.identity_data?.email || 'YouTube Account',
            access_token: session.provider_token || 'connected',
            refresh_token: session.provider_refresh_token || '',
            platform_user_id: googleIdentity.id,
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
        }

        if (!existing) {
          await supabase.from('platform_accounts').insert(accountPayload)
        } else {
          await supabase.from('platform_accounts').update(accountPayload).eq('id', existing.id)
        }
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
