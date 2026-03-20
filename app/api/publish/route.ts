import { inngest } from '@/lib/inngest/client'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId, targetPlatforms, title, description, hashtags } = await request.json()

    if (!videoId || !targetPlatforms?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Verify exact ownership over the video record
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('id, file_path')
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single()

    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // 2. Aggressively verify ALL requested target platform tokens exist in the database
    const { data: accounts } = await supabase
      .from('platform_accounts')
      .select('platform')
      .eq('user_id', user.id)
      .in('platform', targetPlatforms)

    const connectedPlatforms = accounts?.map(a => a.platform) || []
    const missingPlatforms = targetPlatforms.filter(
      (p: string) => !connectedPlatforms.includes(p)
    )

    if (missingPlatforms.length > 0) {
      return NextResponse.json(
        { error: `Missing active credentials for: ${missingPlatforms.join(', ')}` },
        { status: 400 }
      )
    }

    // 3. Update the global video status flag to instantly feedback accurately 
    await supabase
      .from('videos')
      .update({
        publish_status: 'queued',
        youtube_status: null,
        tiktok_status: null,
        facebook_status: null,
        instagram_status: null,
        publish_started_at: new Date().toISOString()
      })
      .eq('id', videoId)

    // 4. Instantly trigger the background worker to execute offline
    const result = await inngest.send({
      name: 'video/publish',
      data: {
        videoId,
        userId: user.id,
        targetPlatforms,
        title: title || '',
        description: description || '',
        hashtags: hashtags || []
      }
    })

    // 5. Instantly return control to user within 15 milliseconds
    return NextResponse.json({
      success: true,
      jobId: result.ids[0],
      status: 'queued',
      message: 'Video is queued and streaming in the background!'
    })

  } catch (error: any) {
    console.error('Publish API fast-fail:', error)
    return NextResponse.json(
      { error: error.message || 'Unknown Server Error' },
      { status: 500 }
    )
  }
}
