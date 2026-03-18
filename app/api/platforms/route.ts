import { createSupabaseServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch connected platforms
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: accounts, error } = await supabase
      .from('platform_accounts')
      .select('id, platform, account_name, connected_at, expires_at')
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ accounts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Connect platform
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // In production, you would exchange OAuth code for tokens here
    // For now, we're accepting pre-obtained tokens

    const { data: account, error } = await supabase
      .from('platform_accounts')
      .insert({
        user_id: user.id,
        platform: body.platform,
        account_name: body.account_name,
        access_token: body.access_token, // Should be encrypted in production
        refresh_token: body.refresh_token,
        platform_user_id: body.platform_user_id,
        expires_at: body.expires_at,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ account: account[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// DELETE - Disconnect platform
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = new URL(request.url).searchParams.get('id')

    const { error } = await supabase
      .from('platform_accounts')
      .delete()
      .eq('id', accountId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ message: 'Platform disconnected' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
