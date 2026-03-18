'use client'

import { motion } from 'framer-motion'
import { FiLink, FiX, FiCheck, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { SiTiktok, SiFacebook } from 'react-icons/si'
import { FiYoutube, FiInstagram } from 'react-icons/fi'
import { useContentHub } from '@/lib/store'
import toast from 'react-hot-toast'

const platformConfigs = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: FiYoutube,
    color: 'from-red-600 to-red-800',
    textColor: 'text-red-400',
    description: 'Upload and manage videos on your YouTube channel',
    instructions: [
      'Create a Google Cloud project',
      'Enable YouTube Data API v3',
      'Create OAuth 2.0 Client ID',
      'Paste credentials below',
    ],
    credentials: ['Client ID', 'Client Secret'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: SiTiktok,
    color: 'from-black to-slate-900',
    textColor: 'text-slate-300',
    description: 'Post videos to your TikTok account',
    instructions: [
      'Register as TikTok Developer',
      'Create an app',
      'Get API credentials',
      'Paste credentials below',
    ],
    credentials: ['Client Key', 'Client Secret'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: FiInstagram,
    color: 'from-pink-600 to-purple-600',
    textColor: 'text-pink-400',
    description: 'Post Reels to your Instagram Business account',
    instructions: [
      'Create Meta Developer account',
      'Create an app',
      'Set up Instagram Graph API',
      'Generate access token',
    ],
    credentials: ['App ID', 'Access Token'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: SiFacebook,
    color: 'from-blue-600 to-blue-800',
    textColor: 'text-blue-400',
    description: 'Post videos to your Facebook Page',
    instructions: [
      'Use Meta Developer account',
      'Configure Facebook Graph API',
      'Get Page access token',
      'Connect your Page',
    ],
    credentials: ['Page ID', 'Access Token'],
  },
]

export default function ConnectionsPage() {
  const { platformAccounts, addPlatformAccount, removePlatformAccount } = useContentHub()

  const handleConnect = (platform: string) => {
    // Mock OAuth flow
    toast.success(`Redirecting to ${platform} OAuth...`)

    setTimeout(() => {
      toast.success(`${platform} connected successfully!`)

      const newAccount = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: '',
        platform: platform as any,
        account_name: `My ${platform} Account`,
        access_token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
        refresh_token: 'mock_refresh_token',
        platform_user_id: 'user_' + Math.random().toString(36).substr(2, 9),
        connected_at: new Date().toISOString(),
      }

      addPlatformAccount(newAccount)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold font-space">Connected Platforms</h1>
        <p className="text-slate-400">
          Connect your social media accounts to start posting automatically
        </p>
      </motion.div>

      {/* Alert */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
      >
        <FiAlertCircle className="text-xl text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-300 mb-1">How it works</p>
          <p className="text-sm text-blue-200">
            Connect each platform once. Then, whenever you upload a video, it automatically posts
            to all connected platforms with platform-specific optimizations.
          </p>
        </div>
      </motion.div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 gap-6">
        {platformConfigs.map((platform, idx) => {
          const Icon = platform.icon
          const isConnected = platformAccounts.some((acc) => acc.platform === platform.id)
          const account = platformAccounts.find((acc) => acc.platform === platform.id)

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card group"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Platform Info */}
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className={`p-3 rounded-lg bg-gradient-to-br ${platform.color}`}
                      whileHover={{ rotate: 10 }}
                    >
                      <Icon className="text-3xl text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        {platform.name}
                        {isConnected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium"
                          >
                            <FiCheck className="text-sm" />
                            Connected
                          </motion.span>
                        )}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">{platform.description}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-300 mb-3">Setup Instructions:</p>
                    {platform.instructions.map((instruction, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 text-sm text-slate-400"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span>{instruction}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right: Connection Action */}
                <div className="flex flex-col justify-between">
                  {isConnected ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-lg bg-slate-700/20 border border-slate-600">
                        <p className="text-sm text-slate-400 mb-2">Connected Account:</p>
                        <p className="font-medium">{account?.account_name}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Connected on{' '}
                          {new Date(account?.connected_at || '').toLocaleDateString()}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          removePlatformAccount(account?.id || '')
                          toast.success(`${platform.name} disconnected`)
                        }}
                        className="w-full py-2 px-4 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                      >
                        <FiX />
                        Disconnect
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 flex flex-col justify-end h-full"
                    >
                      <p className="text-sm text-slate-400 text-center">
                        Not connected yet. Click below to authorize {platform.name}.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleConnect(platform.name.toLowerCase())}
                        className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 bg-gradient-to-r ${platform.color} hover:shadow-lg transition-all`}
                      >
                        <FiLink />
                        Connect {platform.name}
                        <FiArrowRight />
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Connected Summary */}
      {platformAccounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <FiCheck className="text-xl text-green-400" />
            <h3 className="font-bold text-lg text-green-300">Ready to Go! 🎉</h3>
          </div>
          <p className="text-green-200">
            You have {platformAccounts.length} platform(s) connected. You can now upload videos
            and post to all of them simultaneously from the Upload page.
          </p>
        </motion.div>
      )}
    </div>
  )
}
