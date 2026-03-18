'use client'

import { motion } from 'framer-motion'

interface StatsCardProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="card group relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${color}`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
          >
            {value}
          </motion.p>
        </div>

        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          className={`p-3 rounded-lg bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition-all`}
        >
          <Icon className="text-2xl text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
}
