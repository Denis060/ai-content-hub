import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch user analytics
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all analytics for this user
    const { data: analytics, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', user.id)
      .order('fetched_at', { ascending: false })

    if (error) throw error

    // Compute aggregate stats
    const totals = (analytics || []).reduce(
      (acc, row) => ({
        views: acc.views + (row.views || 0),
        likes: acc.likes + (row.likes || 0),
        comments: acc.comments + (row.comments || 0),
        shares: acc.shares + (row.shares || 0),
        watch_time: acc.watch_time + (row.watch_time || 0),
      }),
      { views: 0, likes: 0, comments: 0, shares: 0, watch_time: 0 }
    )

    const avgEngagement =
      analytics && analytics.length > 0
        ? analytics.reduce((sum, r) => sum + (r.engagement_rate || 0), 0) / analytics.length
        : 0

    // Group by platform for distribution
    const byPlatform: Record<string, number> = {}
    ;(analytics || []).forEach((row) => {
      byPlatform[row.platform] = (byPlatform[row.platform] || 0) + row.views
    })

    // Group by date (last 7 entries per platform) for charts
    const recentByDate: Record<string, Record<string, number>> = {}
    ;(analytics || []).forEach((row) => {
      const date = new Date(row.fetched_at).toLocaleDateString('en-US', { weekday: 'short' })
      if (!recentByDate[date]) recentByDate[date] = {}
      recentByDate[date][row.platform] =
        (recentByDate[date][row.platform] || 0) + row.views
    })

    return NextResponse.json({
      analytics: analytics || [],
      totals,
      avgEngagement: Math.round(avgEngagement * 10) / 10,
      byPlatform,
      recentByDate,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Insert analytics record (for platform sync / webhook use)
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

    const { data, error } = await supabase
      .from('analytics')
      .insert({
        user_id: user.id,
        platform: body.platform,
        video_id: body.video_id,
        views: body.views || 0,
        likes: body.likes || 0,
        comments: body.comments || 0,
        shares: body.shares || 0,
        watch_time: body.watch_time || 0,
        engagement_rate: body.engagement_rate || 0,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ analytics: data[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
