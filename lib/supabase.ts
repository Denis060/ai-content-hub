import { createBrowserClient } from '@supabase/ssr'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Browser client for client-side operations
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server client for server-side operations
export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Database types
export interface PlatformAccount {
  id: string
  user_id: string
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook'
  account_name: string
  access_token: string
  refresh_token?: string
  platform_user_id: string
  connected_at: string
  expires_at?: string
}

export interface ScheduledVideo {
  id: string
  user_id: string
  title: string
  description: string
  video_url: string
  thumbnail_url?: string
  scheduled_time: string
  platforms: string[] // ['youtube', 'tiktok', 'instagram', 'facebook']
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  created_at: string
  published_at?: string
}

export interface Analytics {
  id: string
  user_id: string
  platform: string
  video_id: string
  views: number
  likes: number
  comments: number
  shares: number
  watch_time: number
  engagement_rate: number
  fetched_at: string
}
