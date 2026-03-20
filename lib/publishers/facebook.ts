export async function publishToFacebook(
  videoBlob: Blob,
  account: { access_token: string },
  metadata: { title: string; description: string; hashtags: string[] },
  isInstagram: boolean = false
) {
  try {
    // CRITICAL: A User Token CANNOT post to a Facebook Page natively!
    // We must dynamically query Meta's `/me/accounts` to exchange the root auth token 
    // for an active administrative "Page Access Token" the exact moment the worker runs!
    
    const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${account.access_token}`)
    const accountsData = await accountsRes.json()

    if (!accountsData || !accountsData.data || accountsData.data.length === 0) {
      throw new Error("No Facebook Pages found! You must associate a Business Page with your account before publishing.")
    }

    // Grab the very first Administrative Page they own
    const pageId = accountsData.data[0].id
    const pageToken = accountsData.data[0].access_token

    if (!pageToken) {
      throw new Error("Failed to parse the specific Facebook Page's access token.")
    }

    // Construct the payload securely formatted
    const description = metadata.title + 
      (metadata.description ? `\n\n${metadata.description}` : '') +
      (metadata.hashtags?.length ? `\n\n${metadata.hashtags.join(' ')}` : '')

    const formData = new FormData()
    formData.append('source', videoBlob)
    formData.append('title', metadata.title)
    formData.append('description', description)
    formData.append('access_token', pageToken) // MUST USE THE PAGE TOKEN!

    const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/videos`, {
        method: 'POST',
        body: formData
      }
    )

    const data = await response.json()

    if (!response.ok || data.error) {
      throw new Error(`Facebook rejected the stream: ${data.error?.message || response.statusText}`)
    }

    const videoId = data.id

    if (!videoId) throw new Error('Facebook accepted the file but returned completely empty ID')

    return {
      platform: isInstagram ? 'instagram' : 'facebook',  // We currently route both down the same basic pipeline to Page videos
      videoId,
      url: `https://facebook.com/${videoId}`,
      status: 'published'
    }
  } catch (error: any) {
    throw new Error(`Meta Graph API Error: ${error.message || 'Unknown error'}`)
  }
}
