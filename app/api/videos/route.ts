import { createSupabaseServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch user videos
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: videos, error } = await supabase
      .from('scheduled_videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ videos })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create new video
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

    const { data: video, error } = await supabase
      .from('scheduled_videos')
      .insert({
        user_id: user.id,
        title: body.title,
        description: body.description,
        video_url: body.video_url,
        thumbnail_url: body.thumbnail_url,
        scheduled_time: body.scheduled_time,
        platforms: body.platforms,
        status: body.status || 'draft',
      })
      .select()

    if (error) throw error

    return NextResponse.json({ video: video[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// PUT - Update video
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const videoId = new URL(request.url).searchParams.get('id')

    const { data: video, error } = await supabase
      .from('scheduled_videos')
      .update(body)
      .eq('id', videoId)
      .eq('user_id', user.id)
      .select()

    if (error) throw error

    return NextResponse.json({ video: video[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// DELETE - Delete video
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const videoId = new URL(request.url).searchParams.get('id')

    const { error } = await supabase
      .from('scheduled_videos')
      .delete()
      .eq('id', videoId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ message: 'Video deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
