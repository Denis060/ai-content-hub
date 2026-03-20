import { inngest } from './client'
import { createClient } from '@supabase/supabase-js'
import { publishToYouTube } from '../publishers/youtube'
import { publishToTikTok } from '../publishers/tiktok'
import { publishToFacebook } from '../publishers/facebook'

// Note: Background workers cannot access Cookies securely, so we MUST use the Service Role key to actively act on behalf of users!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
)

export const publishVideoJob = inngest.createFunction(
  {
    id: 'video-publish',
    name: 'Publish Video to Platforms',
    concurrency: { limit: 10 }, // Max 10 concurrent publishing jobs globally to stay well-below rate limits
    retries: 3 // Resilient exponential backoff out of the box
  },
  { event: 'video/publish' },
  async ({ event, step }) => {
    const { videoId, userId, targetPlatforms, title, description, hashtags } = event.data

    console.log(`[Job] Starting publish execution sequentially mapping ${targetPlatforms.join(', ')} for video ${videoId}`)

    // 1. Securely fetch the physical video file directly from the private bucket
    const signedUrlData = await step.run('get-signed-url', async () => {
      const { data: video, error: fetchError } = await supabase
        .from('scheduled_videos')
        .select('file_path')
        .eq('id', videoId)
        .single()

      if (fetchError || !video?.file_path) throw new Error('Video file not physically found in database')

      const { data, error } = await supabase.storage
        .from('videos')
        .createSignedUrl(video.file_path, 3600) // Extends URL access for exactly 1 hour for long uploads

      if (error || !data) throw new Error(`Failed to create signed streaming URL: ${error?.message}`)
      
      return data.signedUrl
    })

    // 2. Concurrently execute publishers safely
    const publishResults = await Promise.all(
      targetPlatforms.map(platform =>
        step.run(`publish-to-${platform}`, async () => {
          try {
            console.log(`[Platform] Negotiating stream to ${platform}...`)

            const { data: account, error: accountError } = await supabase
              .from('platform_accounts')
              .select('access_token, refresh_token')
              .eq('user_id', userId)
              .eq('platform', platform)
              .single()

            if (accountError || !account) {
              throw new Error(`CRITICAL: No ${platform} OAuth token legally attached to user`)
            }

            // Report granularly that we started
            await supabase.from('scheduled_videos')
              .update({ [`${platform}_status`]: 'uploading' })
              .eq('id', videoId)

            // Convert Signed URL into a physical Blob for passing to adapters safely bypassing Node filesystem limits
            const streamResponse = await fetch(signedUrlData)
            const videoBlob = await streamResponse.blob()

            let result
            switch (platform) {
              case 'youtube':
                result = await publishToYouTube(videoBlob, account, { title, description, hashtags })
                break
              case 'tiktok':
                result = await publishToTikTok(videoBlob, account, { title, description, hashtags })
                break
              case 'facebook':
              case 'instagram':
                result = await publishToFacebook(videoBlob, account, { title, description, hashtags }, platform === 'instagram')
                break
              default:
                throw new Error(`CRITICAL: Unknown network adapter: ${platform}`)
            }

            // Flag success
            await supabase.from('scheduled_videos')
              .update({
                [`${platform}_status`]: 'published',
                [`${platform}_video_id`]: result.videoId,
                [`${platform}_url`]: result.url
              })
              .eq('id', videoId)

            console.log(`[Platform] ✅ ${platform} successfully accepted stream layout`)

            return { platform, success: true, videoId: result.videoId, url: result.url }

          } catch (error: any) {
            console.error(`[Platform] ❌ ${platform} strictly failed the stream processing:`, error)

            await supabase.from('scheduled_videos')
              .update({
                [`${platform}_status`]: 'failed'
              })
              .eq('id', videoId)

            return { platform, success: false, error: error.message }
          }
        })
      )
    )

    // 3. Document the final collective job status across all shards
    const allSuccess = publishResults.every(r => r.success)
    const successCount = publishResults.filter(r => r.success).length

    await supabase.from('scheduled_videos')
      .update({
        publish_status: allSuccess ? 'published' : 'failed',
        publish_completed_at: new Date().toISOString(),
        publish_results: publishResults
      })
      .eq('id', videoId)

    return { success: allSuccess, results: publishResults }
  }
)
