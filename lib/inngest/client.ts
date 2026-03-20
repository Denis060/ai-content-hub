import { Inngest } from 'inngest'

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'ai-content-hub',
  name: 'AI Content Hub'
})

// Define strictly typed event payloads for our Background Queue
export type Events = {
  'video/publish': {
    data: {
      videoId: string
      userId: string
      targetPlatforms: string[]
      title: string
      description: string
      hashtags: string[]
    }
  }
}
