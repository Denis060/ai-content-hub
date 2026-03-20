'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiHome,
  FiUpload,
  FiBarChart2,
  FiSettings,
  FiLink2,
  FiPlay,
  FiSend,
} from 'react-icons/fi'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/upload', label: 'Upload Video', icon: FiUpload },
  { href: '/publish', label: 'Publish Video', icon: FiSend },
  { href: '/scheduled', label: 'Scheduled', icon: FiPlay },
  { href: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { href: '/connections', label: 'Connections', icon: FiLink2 },
  { href: '/settings', label: 'Settings', icon: FiSettings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-sm">CH</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Content Hub</h1>
            <p className="text-xs text-slate-400">AI Automation</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item, i) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
                      : 'text-slate-300 hover:bg-slate-700/30'
                  }`}
                >
                  <Icon className="text-xl flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-lg p-4 text-center"
        >
          <p className="text-sm font-medium text-blue-300 mb-2">💡 Pro Tip</p>
          <p className="text-xs text-slate-300">
            Connect all platforms to post videos simultaneously
          </p>
        </motion.div>
      </div>
    </aside>
  )
}
