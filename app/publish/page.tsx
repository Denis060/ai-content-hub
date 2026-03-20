'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiClock, FiAlertCircle, FiVideo, FiXCircle } from 'react-icons/fi'
import { SiTiktok, SiFacebook } from 'react-icons/si'
import { FiYoutube, FiInstagram } from 'react-icons/fi'

interface Video {
  id: string
  title: string
  description: string
  video_url: string
  thumbnail_url?: string
}

interface PublishStatus {
  youtube?: 'uploading' | 'published' | 'failed'
  tiktok?: 'uploading' | 'published' | 'failed'
  facebook?: 'uploading' | 'published' | 'failed'
  instagram?: 'uploading' | 'published' | 'failed'
}

export default function PublishPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  
  const [platforms, setPlatforms] = useState({
    youtube: false,
    tiktok: false,
    facebook: false,
    instagram: false
  })

  const [publishing, setPublishing] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<PublishStatus>({})

  // Fetch user videos directly from API
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos')
        const data = await res.json()
        setVideos(data.videos || [])
      } catch (err) {
        console.error('Failed to load videos', err)
      }
    }
    fetchVideos()
  }, [])

  // Poll job status 
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (jobId && publishing) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/publish/status/${jobId}?videoId=${selectedVideo?.id}`)
          const data = await res.json()
          
          if (data.status) setStatus(data.status)
            
          if (data.complete) {
            setPublishing(false)
            clearInterval(interval)
          }
        } catch (err) {
          console.error('Failed fetching Inngest status', err)
        }
      }, 1500)
    }
    return () => clearInterval(interval)
  }, [jobId, publishing, selectedVideo])

  const handlePublish = async () => {
    if (!selectedVideo) return

    const targetPlatforms = Object.keys(platforms).filter((p) => platforms[p as keyof typeof platforms])
    
    if (!targetPlatforms.length) {
      alert('Please select at least one platform!')
      return
    }

    setPublishing(true)
    setStatus({})

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: selectedVideo.id,
          targetPlatforms,
          title: selectedVideo.title,
          description: selectedVideo.description,
          hashtags: ['AI', 'ContentHub', 'Viral']
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to queue publishing job')
      }

      setJobId(data.jobId)

    } catch (error: any) {
      alert(`Error: ${error.message}`)
      setPublishing(false)
    }
  }

  const platformIcons: Record<string, any> = {
    youtube: <FiYoutube className="text-red-500 text-xl" />,
    tiktok: <SiTiktok className="text-slate-300 text-xl" />,
    facebook: <SiFacebook className="text-blue-500 text-xl" />,
    instagram: <FiInstagram className="text-pink-500 text-xl" />
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-10"
      >
        <h1 className="text-4xl font-bold font-space">Publish Center 🚀</h1>
        <p className="text-slate-400">
          Select a video from your vault and blast it simultaneously across the internet.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Video Selection Gallery */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <FiVideo className="text-blue-400" /> Vault
          </h2>
          
          {videos.length === 0 ? (
            <div className="bg-slate-800/30 border border-slate-700/50 p-12 rounded-xl text-center">
              <p className="text-slate-400">No videos exist in your vault yet. Head to Upload!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedVideo(video)}
                  className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                    selectedVideo?.id === video.id
                      ? 'border-blue-500 ring-4 ring-blue-500/20 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  <div className="w-full h-32 bg-slate-900 flex items-center justify-center">
                    {/* Placeholder thumbnail block */}
                    <FiVideo className="text-4xl text-slate-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm truncate">{video.title || 'Untitled'}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {video.description || 'No description provided'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right: The Publisher Command Center */}
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800 border border-slate-700 p-6 rounded-xl h-fit sticky top-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6">Target Runways</h2>

            <div className="space-y-3 mb-8">
              {['youtube', 'tiktok', 'facebook', 'instagram'].map((platform) => (
                <label 
                  key={platform} 
                  className={`flex flex-row p-4 rounded-lg border items-center justify-between cursor-pointer transition-colors ${
                    platforms[platform as keyof typeof platforms] 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {platformIcons[platform]}
                    <span className="font-bold text-sm capitalize">{platform}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={platforms[platform as keyof typeof platforms]}
                    onChange={(e) =>
                      setPlatforms({ ...platforms, [platform]: e.target.checked })
                    }
                    disabled={publishing}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500/50"
                  />
                </label>
              ))}
            </div>

            {/* Live Progress Status Terminal */}
            {publishing && (
              <div className="mb-8 p-4 bg-black/40 rounded-lg space-y-3 border border-slate-900 shadow-inner font-mono text-sm">
                <p className="text-slate-500 mb-2 border-b border-slate-800 pb-2">JOB QUEUED [IN_PROGRESS]</p>
                {Object.keys(platforms).filter(p => platforms[p as keyof typeof platforms]).map((platform) => {
                  const s = status[platform as keyof PublishStatus]
                  return (
                    <div key={platform} className="flex justify-between items-center">
                      <span className="capitalize text-slate-300">{platform}</span>
                      {!s && <span className="text-yellow-500 flex items-center gap-1"><FiClock className="animate-spin" /> Queued</span>}
                      {s === 'uploading' && <span className="text-blue-400 flex items-center gap-1"><FiClock className="animate-spin" /> Uploading</span>}
                      {s === 'published' && <span className="text-green-500 flex items-center gap-1"><FiCheckCircle /> Live</span>}
                      {s === 'failed' && <span className="text-red-500 flex items-center gap-1"><FiXCircle /> Failed</span>}
                    </div>
                  )
                })}
              </div>
            )}

            <motion.button
              whileHover={!publishing ? { scale: 1.02 } : {}}
              whileTap={!publishing ? { scale: 0.98 } : {}}
              onClick={handlePublish}
              disabled={publishing || !Object.values(platforms).some(Boolean)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:grayscale transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {publishing ? (
                <>
                  <FiClock className="animate-spin text-xl" /> Transmitting...
                </>
              ) : (
                '🚀 Blast Off'
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
