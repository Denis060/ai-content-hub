'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const fallbackData = [
  { date: 'Mon', youtube: 0, tiktok: 0, instagram: 0, facebook: 0 },
  { date: 'Tue', youtube: 0, tiktok: 0, instagram: 0, facebook: 0 },
  { date: 'Wed', youtube: 0, tiktok: 0, instagram: 0, facebook: 0 },
  { date: 'Thu', youtube: 0, tiktok: 0, instagram: 0, facebook: 0 },
  { date: 'Fri', youtube: 0, tiktok: 0, instagram: 0, facebook: 0 },
  { date: 'Sat', youtube: 0, tiktok: 0, instagram: 0, facebook: 0 },
  { date: 'Sun', youtube: 0, tiktok: 0, instagram: 0, facebook: 0 },
]

export default function AnalyticsChart() {
  const [data, setData] = useState(fallbackData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/analytics')
        if (!res.ok) return
        const json = await res.json()

        if (json.recentByDate && Object.keys(json.recentByDate).length > 0) {
          const chartData = Object.entries(json.recentByDate).map(
            ([date, platforms]: [string, any]) => ({
              date,
              youtube: platforms.youtube || 0,
              tiktok: platforms.tiktok || 0,
              instagram: platforms.instagram || 0,
              facebook: platforms.facebook || 0,
            })
          )
          setData(chartData)
        }
      } catch (e) {
        console.error('Failed to fetch chart data', e)
      }
    }
    fetchData()
  }, [])

  const hasData = data.some(
    (d) => d.youtube > 0 || d.tiktok > 0 || d.instagram > 0 || d.facebook > 0
  )

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Weekly Views</h2>
      {!hasData && (
        <p className="text-sm text-slate-500 mb-4">
          Analytics will appear here once your videos start getting views.
        </p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          <Legend />
          <Line
            type="monotone"
            dataKey="youtube"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="tiktok"
            stroke="#64748b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="instagram"
            stroke="#ec4899"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="facebook"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
