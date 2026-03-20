export async function publishToTikTok(
  videoBlob: Blob,
  account: { access_token: string },
  metadata: { title: string; description: string; hashtags: string[] }
) {
  try {
    // 1. Initialize upload session
    const initResponse = await fetch('https://open.tiktok.com/v1/post/publish/video/init/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_info: {
            source: 'FILE_UPLOAD'
          }
        })
      }
    )

    if (!initResponse.ok) {
      const errText = await initResponse.text()
      throw new Error(`TikTok session rejected: ${initResponse.statusText} - ${errText}`)
    }

    const initData = await initResponse.json()
    const uploadToken = initData.data?.upload_token

    if (!uploadToken) throw new Error('TikTok servers failed to generate an upload token.')

    // 2. Upload the massive video file using multipart forms
    const formData = new FormData()
    formData.append('file', videoBlob)
    formData.append('upload_token', uploadToken)

    const uploadResponse = await fetch('https://open.tiktok.com/v1/post/publish/video/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.access_token}`
        },
        body: formData
      }
    )

    if (!uploadResponse.ok) {
      throw new Error(`TikTok chunks rejected: ${uploadResponse.statusText}`)
    }

    // 3. Command TikTok to construct and formally publish the completed upload to the user's feed
    const fullDescription = metadata.title + 
      (metadata.description ? `\n\n${metadata.description}` : '') +
      (metadata.hashtags?.length ? `\n\n${metadata.hashtags.join(' ')}` : '')

    const publishResponse = await fetch('https://open.tiktok.com/v1/post/publish/action/publish/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          upload_token: uploadToken,
          post_info: {
            desc: fullDescription.substring(0, 2200), // TikTok character limit bounds strictly
            privacy_level: 0, // Public level
            allow_duet: true,
            allow_stitch: true
          }
        })
      }
    )

    if (!publishResponse.ok) {
      throw new Error(`TikTok action rejected: ${publishResponse.statusText}`)
    }

    const publishData = await publishResponse.json()
    const videoId = publishData.data?.video_id

    if (!videoId) throw new Error('TikTok completed upload but returned no public Video ID')

    return {
      platform: 'tiktok',
      videoId,
      url: `https://www.tiktok.com/@user/video/${videoId}`,
      status: 'published'
    }
  } catch (error: any) {
    throw new Error(`TikTok Network Error: ${error.message || 'Unknown error'}`)
  }
}
