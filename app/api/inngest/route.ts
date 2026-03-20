import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { publishVideoJob } from '@/lib/inngest/functions'
import { syncAnalyticsJob } from '@/lib/inngest/analytics'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    publishVideoJob,
    syncAnalyticsJob
  ],
})
