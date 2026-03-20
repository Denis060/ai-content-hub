import { google } from 'googleapis'

export async function publishToYouTube(
  videoBlob: Blob,
  account: { access_token: string; refresh_token: string | null },
  metadata: { title: string; description: string; hashtags: string[] }
) {
  try {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token // Crucial for long-lived offline access
    })

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    })

    // Prepare Node.js fetch stream to avoid downloading heavily into local filesystem
    // We pass the raw Web API Blob directly into Google API's media body
    const buffer = Buffer.from(await videoBlob.arrayBuffer())

    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description + (metadata.hashtags?.length ? `\n\n${metadata.hashtags.join(' ')}` : ''),
          tags: metadata.hashtags || [],
          categoryId: '28' // Science & Technology default
        },
        status: {
          privacyStatus: 'public', // Set to public for production
          madeForKids: false
        }
      },
      media: {
        body: require('stream').Readable.from(buffer)
      }
    })

    return {
      platform: 'youtube',
      videoId: response.data.id!,
      url: `https://youtube.com/watch?v=${response.data.id}`,
      status: 'published'
    }
  } catch (error: any) {
    throw new Error(`YouTube Network Error: ${error.message || 'Unknown error'}`)
  }
}
