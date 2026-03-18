'use client'

import { motion } from 'framer-motion'
import { useContentHub } from '@/lib/store'
import { FiYoutube, FiInstagram, FiPlay, FiTrash2 } from 'react-icons/fi'
import { SiTiktok, SiFacebook } from 'react-icons/si'
import { format } from 'date-fns'

const platformIcons = {
  youtube: { icon: FiYoutube, color: 'text-red-400' },
  tiktok: { icon: SiTiktok, color: 'text-slate-300' },
  instagram: { icon: FiInstagram, color: 'text-pink-400' },
  facebook: { icon: SiFacebook, color: 'text-blue-400' },
}

export default function RecentVideos() {
  const { videos, deleteVideo } = useContentHub()
  const recentVideos = videos.slice(0, 5)

  if (recentVideos.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12 text-center">
        <FiPlay className="text-4xl text-slate-600 mb-4" />
        <p className="text-slate-400">No videos yet. Upload your first video to get started!</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Recent Videos</h2>

      <div className="space-y-4">
        {recentVideos.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-colors group"
          >
            {/* Thumbnail placeholder */}
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex-shrink-0 flex items-center justify-center">
              <FiPlay className="text-2xl text-slate-500" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-bold line-clamp-2">{video.title}</h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                {video.description}
              </p>

              {/* Platforms */}
              <div className="flex items-center gap-2 mt-3">
                {video.platforms.map((platform) => {
                  const PlatformIcon = platformIcons[platform as keyof typeof platformIcons]?.icon
                  const color = platformIcons[platform as keyof typeof platformIcons]?.color
                  return PlatformIcon ? (
                    <motion.div
                      key={platform}
                      className={`p-1 rounded text-lg ${color}`}
                      whileHover={{ scale: 1.2 }}
                    >
                      <PlatformIcon />
                    </motion.div>
                  ) : null
                })}
              </div>

              {/* Meta info */}
              <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                <div>
                  {video.status === 'published' ? (
                    <span className="badge badge-success">Published</span>
                  ) : video.status === 'scheduled' ? (
                    <span className="badge badge-warning">
                      Scheduled for {format(new Date(video.scheduled_time), 'MMM d')}
                    </span>
                  ) : (
                    <span className="badge">Draft</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => deleteVideo(video.id)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
            >
              <FiTrash2 />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
