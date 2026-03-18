'use client'

import { useContentHub } from '@/lib/store'
import { motion } from 'framer-motion'
import { FiLogOut, FiSearch, FiBell } from 'react-icons/fi'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user, setUser } = useContentHub()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  return (
    <nav className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-md sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search videos..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <FiBell className="text-xl text-slate-300" />
          </motion.button>

          <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name || user?.email}</p>
              <p className="text-xs text-slate-400">Content Creator</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
              title="Logout"
            >
              <FiLogOut />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}
