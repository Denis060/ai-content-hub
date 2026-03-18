'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiMail, FiLock, FiBell, FiShield } from 'react-icons/fi'
import { useContentHub } from '@/lib/store'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, setUser } = useContentHub()
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy'>('account')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState({
    emailOnPost: true,
    emailOnAnalytics: true,
    emailWeeklySummary: true,
    pushNotifications: false,
  })

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      // Simulate update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser({
        ...user!,
        name: formData.name,
        email: formData.email,
      })

      toast.success('Account updated successfully!')
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Failed to update account')
    }
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: FiMail },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'privacy', label: 'Privacy', icon: FiShield },
  ]

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold font-space">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-3 font-medium flex items-center gap-2 transition-all relative ${
                activeTab === tab.id
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <TabIcon className="text-lg" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleAccountUpdate}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-6">Account Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  disabled
                />
                <p className="text-xs text-slate-400 mt-2">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FiLock className="text-lg" />
              Change Password
            </h2>

            <form onSubmit={handleAccountUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                <FiSave />
                Save Changes
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {key === 'emailOnPost' && 'Email when video is posted'}
                    {key === 'emailOnAnalytics' && 'Email weekly analytics'}
                    {key === 'emailWeeklySummary' && 'Email weekly summary'}
                    {key === 'pushNotifications' && 'Push notifications'}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {key === 'emailOnPost' && 'Get notified when your video successfully posts'}
                    {key === 'emailOnAnalytics' && 'Receive detailed analytics reports'}
                    {key === 'emailWeeklySummary' && 'Get a summary of your channel activity'}
                    {key === 'pushNotifications' && 'Receive browser push notifications'}
                  </p>
                </div>

                <motion.input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setNotifications({ ...notifications, [key]: e.target.checked })
                  }
                  className="w-5 h-5 cursor-pointer"
                />
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success('Notification settings saved!')}
            className="w-full mt-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <FiSave />
            Save Preferences
          </motion.button>
        </motion.div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">Data & Privacy</h2>
            <p className="text-slate-300 mb-4">
              Your data is encrypted and secure. We never share your information with third
              parties.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-700/20 rounded">
                <p className="font-medium text-sm">✅ End-to-end encrypted communications</p>
              </div>
              <div className="p-3 bg-slate-700/20 rounded">
                <p className="font-medium text-sm">✅ Secure password hashing</p>
              </div>
              <div className="p-3 bg-slate-700/20 rounded">
                <p className="font-medium text-sm">✅ GDPR compliant</p>
              </div>
              <div className="p-3 bg-slate-700/20 rounded">
                <p className="font-medium text-sm">✅ Regular security audits</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">Account Actions</h2>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast.success('Data exported. Check your email.')}
                className="w-full py-2 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 font-medium transition-colors"
              >
                📥 Export My Data
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast.success('Account deleted. Goodbye!')}
                className="w-full py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-colors"
              >
                ❌ Delete Account
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
