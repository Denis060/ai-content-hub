'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { date: 'Mon', youtube: 2400, tiktok: 2210, instagram: 2290, facebook: 2000 },
  { date: 'Tue', youtube: 1398, tiktok: 2210, instagram: 2000, facebook: 2181 },
  { date: 'Wed', youtube: 9800, tiktok: 2290, instagram: 2000, facebook: 2500 },
  { date: 'Thu', youtube: 3908, tiktok: 2000, instagram: 2181, facebook: 2100 },
  { date: 'Fri', youtube: 4800, tiktok: 2181, instagram: 2500, facebook: 2290 },
  { date: 'Sat', youtube: 3800, tiktok: 2500, instagram: 2100, facebook: 2000 },
  { date: 'Sun', youtube: 4300, tiktok: 2100, instagram: 2300, facebook: 2500 },
]

export default function AnalyticsChart() {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Weekly Views</h2>
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
            stroke="#000000"
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
