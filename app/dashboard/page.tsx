'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiYoutube, FiInstagram, FiTrendingUp, FiWatch } from 'react-icons/fi'
import { SiTiktok, SiFacebook } from 'react-icons/si'
import { useContentHub } from '@/lib/store'
import PlatformCard from '@/components/dashboard/PlatformCard'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentVideos from '@/components/dashboard/RecentVideos'
import AnalyticsChart from '@/components/dashboard/AnalyticsChart'

export default function DashboardPage() {
  const { platformAccounts, videos, setShowUploadModal } = useContentHub()

  const platforms = [
    {
      id: 'youtube',
      name: 'YouTube',
      icon: FiYoutube,
      color: 'from-red-600 to-red-800',
      accentColor: 'text-red-400',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: SiTiktok,
      color: 'from-black to-slate-900',
      accentColor: 'text-slate-300',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FiInstagram,
      color: 'from-pink-600 to-purple-600',
      accentColor: 'text-pink-400',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: SiFacebook,
      color: 'from-blue-600 to-blue-800',
      accentColor: 'text-blue-400',
    },
  ]

  const stats = [
    {
      label: 'Total Videos',
      value: videos.length.toString(),
      icon: FiWatch,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Connected Platforms',
      value: platformAccounts.length.toString(),
      icon: FiTrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Scheduled Posts',
      value: videos.filter((v) => v.status === 'scheduled').length.toString(),
      icon: FiWatch,
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold font-space">Content Hub Dashboard</h1>
        <p className="text-slate-400">
          Manage and automate your content across all platforms
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Platform Connections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Connected Platforms</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            + New Video
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform, i) => {
            const isConnected = platformAccounts.some(
              (acc) => acc.platform === platform.id
            )
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <PlatformCard
                  platform={platform}
                  isConnected={isConnected}
                />
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AnalyticsChart />
      </motion.div>

      {/* Recent Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <RecentVideos />
      </motion.div>
    </div>
  )
}
