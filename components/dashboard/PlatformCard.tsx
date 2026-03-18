'use client'

import { motion } from 'framer-motion'
import { FiLink, FiCheck } from 'react-icons/fi'
import { useContentHub, useContentHub as useStore } from '@/lib/store'

interface PlatformCardProps {
  platform: {
    id: string
    name: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    accentColor: string
  }
  isConnected: boolean
}

export default function PlatformCard({ platform, isConnected }: PlatformCardProps) {
  const Icon = platform.icon
  const { setShowConnectModal } = useStore()

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`card group relative overflow-hidden cursor-pointer`}
      onClick={() => !isConnected && setShowConnectModal(true)}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${platform.color} transition-opacity duration-300`}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        <motion.div
          className={`p-3 rounded-lg bg-gradient-to-br ${platform.color}`}
          whileHover={{ rotate: 10 }}
        >
          <Icon className="text-2xl text-white" />
        </motion.div>

        <div>
          <h3 className="font-bold text-lg">{platform.name}</h3>
          {isConnected ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 justify-center mt-2 text-green-400 text-sm font-medium"
            >
              <FiCheck /> Connected
            </motion.div>
          ) : (
            <p className="text-slate-400 text-sm mt-2">
              Click to connect
            </p>
          )}
        </div>

        {!isConnected && (
          <motion.div
            className="mt-2 px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiLink className="text-xs" />
            Connect Account
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
