import { create } from 'zustand'
import { PlatformAccount, ScheduledVideo, Analytics } from './supabase'

interface User {
  id: string
  email: string
  name?: string
}

interface ContentHubState {
  // User state
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void

  // Platform accounts
  platformAccounts: PlatformAccount[]
  setPlatformAccounts: (accounts: PlatformAccount[]) => void
  addPlatformAccount: (account: PlatformAccount) => void
  removePlatformAccount: (id: string) => void

  // Videos
  videos: ScheduledVideo[]
  setVideos: (videos: ScheduledVideo[]) => void
  addVideo: (video: ScheduledVideo) => void
  updateVideo: (id: string, video: Partial<ScheduledVideo>) => void
  deleteVideo: (id: string) => void

  // Analytics
  analytics: Analytics[]
  setAnalytics: (analytics: Analytics[]) => void

  // UI state
  selectedPlatforms: string[]
  setSelectedPlatforms: (platforms: string[]) => void
  togglePlatform: (platform: string) => void

  // Modal states
  showConnectModal: boolean
  setShowConnectModal: (show: boolean) => void
  showUploadModal: boolean
  setShowUploadModal: (show: boolean) => void
}

export const useContentHub = create<ContentHubState>((set) => ({
  // User
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Platform accounts
  platformAccounts: [],
  setPlatformAccounts: (accounts) => set({ platformAccounts: accounts }),
  addPlatformAccount: (account) =>
    set((state) => ({
      platformAccounts: [...state.platformAccounts, account],
    })),
  removePlatformAccount: (id) =>
    set((state) => ({
      platformAccounts: state.platformAccounts.filter((a) => a.id !== id),
    })),

  // Videos
  videos: [],
  setVideos: (videos) => set({ videos }),
  addVideo: (video) =>
    set((state) => ({
      videos: [video, ...state.videos],
    })),
  updateVideo: (id, video) =>
    set((state) => ({
      videos: state.videos.map((v) => (v.id === id ? { ...v, ...video } : v)),
    })),
  deleteVideo: (id) =>
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id),
    })),

  // Analytics
  analytics: [],
  setAnalytics: (analytics) => set({ analytics }),

  // Selected platforms
  selectedPlatforms: [],
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),

  // Modal states
  showConnectModal: false,
  setShowConnectModal: (show) => set({ showConnectModal: show }),
  showUploadModal: false,
  setShowUploadModal: (show) => set({ showUploadModal: show }),
}))
