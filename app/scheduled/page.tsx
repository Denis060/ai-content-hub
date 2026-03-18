'use client'

import { motion } from 'framer-motion'
import { FiClock, FiTrash2, FiPlay, FiPause, FiEdit2 } from 'react-icons/fi'
import { useContentHub } from '@/lib/store'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { SiTiktok, SiFacebook } from 'react-icons/si'
import { FiYoutube, FiInstagram } from 'react-icons/fi'

const platformIcons = {
  youtube: FiYoutube,
  tiktok: SiTiktok,
  instagram: FiInstagram,
  facebook: SiFacebook,
}

export default function ScheduledPage() {
  const { videos, deleteVideo, updateVideo } = useContentHub()
  const scheduledVideos = videos.filter((v) => v.status === 'scheduled')

  if (scheduledVideos.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold font-space">Scheduled Videos</h1>
          <p className="text-slate-400">View and manage all your scheduled posts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card flex flex-col items-center justify-center py-16 text-center"
        >
          <FiClock className="text-6xl text-slate-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Scheduled Videos</h2>
          <p className="text-slate-400 mb-6 max-w-sm">
            You haven't scheduled any videos yet. Go to Upload to create your first scheduled post!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = '/upload')}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Schedule a Video
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold font-space">Scheduled Videos</h1>
        <p className="text-slate-400">
          You have {scheduledVideos.length} video(s) scheduled to post
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-4">
        {scheduledVideos
          .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
          .map((video, idx) => {
            const scheduledDate = new Date(video.scheduled_time)
            const isPast = scheduledDate < new Date()

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card group relative overflow-hidden"
              >
                {/* Status Indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isPast ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                />

                <div className="grid md:grid-cols-4 gap-6 items-center">
                  {/* Info */}
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-lg line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                      {video.description}
                    </p>

                    {/* Platforms */}
                    <div className="flex items-center gap-2 mt-3">
                      {video.platforms.map((platform) => {
                        const IconComponent =
                          platformIcons[platform as keyof typeof platformIcons]
                        return IconComponent ? (
                          <motion.div
                            key={platform}
                            whileHover={{ scale: 1.2 }}
                            className="p-1.5 rounded bg-slate-700/30 text-slate-300"
                          >
                            <IconComponent className="text-sm" />
                          </motion.div>
                        ) : null
                      })}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Scheduled for</p>
                    <p className="font-bold text-sm">
                      {format(scheduledDate, 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {format(scheduledDate, 'HH:mm')}
                    </p>
                    {!isPast && (
                      <p className="text-xs text-blue-400 mt-2">
                        {formatDistanceToNow(scheduledDate, { addSuffix: true })}
                      </p>
                    )}
                    {isPast && (
                      <p className="text-xs text-red-400 mt-2">Posted</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toast.success('Edit coming soon!')}
                      className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </motion.button>

                    {!isPast && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/videos?id=${video.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'draft' }),
                            })
                            if (!res.ok) throw new Error('Failed to update')
                            updateVideo(video.id, { status: 'draft' })
                            toast.success('Video paused')
                          } catch (error) {
                            toast.error('Failed to pause video')
                          }
                        }}
                        className="p-2 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors"
                        title="Pause"
                      >
                        <FiPause />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/videos?id=${video.id}`, { method: 'DELETE' })
                          if (!res.ok) throw new Error('Failed to delete')
                          deleteVideo(video.id)
                          toast.success('Video deleted')
                        } catch (error) {
                          toast.error('Failed to delete video')
                        }
                      }}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-1">Total Scheduled</p>
          <p className="text-3xl font-bold">{scheduledVideos.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-1">This Week</p>
          <p className="text-3xl font-bold">
            {
              scheduledVideos.filter((v) => {
                const diff =
                  new Date(v.scheduled_time).getTime() - new Date().getTime()
                return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
              }).length
            }
          </p>
        </div>
        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">
            {
              scheduledVideos.filter((v) => {
                const diff =
                  new Date(v.scheduled_time).getTime() - new Date().getTime()
                return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000
              }).length
            }
          </p>
        </div>
      </motion.div>
    </div>
  )
}
