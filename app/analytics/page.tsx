'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useContentHub } from '@/lib/store'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { FiTrendingUp, FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi'
import { FiShare2 } from 'react-icons/fi'

const colors = ['#ef4444', '#64748b', '#ec4899', '#3b82f6']

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString()
}

export default function AnalyticsPage() {
  const { videos, platformAccounts } = useContentHub()
  const publishedVideos = videos.filter((v) => v.status === 'published')

  const [totals, setTotals] = useState({ views: 0, likes: 0, comments: 0, shares: 0, watch_time: 0 })
  const [avgEngagement, setAvgEngagement] = useState(0)
  const [byPlatform, setByPlatform] = useState<Record<string, number>>({})
  const [recentByDate, setRecentByDate] = useState<Record<string, Record<string, number>>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics')
        if (!res.ok) return
        const data = await res.json()
        setTotals(data.totals)
        setAvgEngagement(data.avgEngagement)
        setByPlatform(data.byPlatform || {})
        setRecentByDate(data.recentByDate || {})
      } catch (e) {
        console.error('Failed to fetch analytics', e)
      } finally {
        setLoaded(true)
      }
    }
    fetchAnalytics()
  }, [])

  const hasData = totals.views > 0 || totals.likes > 0

  // Build chart data from API response
  const viewData = Object.entries(recentByDate).map(([date, platforms]) => ({
    date,
    views: Object.values(platforms).reduce((sum, v) => sum + v, 0),
  }))

  const platformData = Object.entries(byPlatform).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  const engagementData = [
    { metric: 'Views', value: totals.views },
    { metric: 'Likes', value: totals.likes },
    { metric: 'Comments', value: totals.comments },
    { metric: 'Shares', value: totals.shares },
  ]

  const stats = [
    {
      label: 'Total Views',
      value: formatNumber(totals.views),
      icon: FiEye,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Likes',
      value: formatNumber(totals.likes),
      icon: FiHeart,
      color: 'from-red-500 to-pink-500',
    },
    {
      label: 'Total Comments',
      value: formatNumber(totals.comments),
      icon: FiMessageCircle,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Total Shares',
      value: formatNumber(totals.shares),
      icon: FiShare2,
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
        <h1 className="text-4xl font-bold font-space">Analytics Dashboard</h1>
        <p className="text-slate-400">Track your video performance across all platforms</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mt-1`}
                  >
                    {stat.value}
                  </motion.p>
                </div>

                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} opacity-20 group-hover:opacity-30 transition-all`}
                >
                  <Icon className="text-2xl text-white" />
                </motion.div>
              </div>

              {!hasData && (
                <p className="text-xs text-slate-500 mt-1">
                  No data yet
                </p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">Weekly Views</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">Platform Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card lg:col-span-2"
        >
          <h2 className="text-xl font-bold mb-6">Engagement Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="metric" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Published Videos</p>
          <p className="text-3xl font-bold">{publishedVideos.length}</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Connected Platforms</p>
          <p className="text-3xl font-bold">{platformAccounts.length}</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm mb-2">Avg. Engagement Rate</p>
          <p className="text-3xl font-bold">{avgEngagement}%</p>
        </div>
      </motion.div>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 text-sm text-slate-400"
      >
        <p>
          📊 Analytics update every hour. Real-time data comes from each platform's native APIs.
        </p>
      </motion.div>
    </div>
  )
}
