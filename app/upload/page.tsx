'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useContentHub } from '@/lib/store'
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { SiTiktok } from 'react-icons/si'
import { FiYoutube, FiInstagram } from 'react-icons/fi'
import { SiFacebook } from 'react-icons/si'
import toast from 'react-hot-toast'

export default function UploadPage() {
  const { platformAccounts, addVideo, selectedPlatforms, togglePlatform } = useContentHub()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledTime: '',
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: FiYoutube, color: 'text-red-400' },
    { id: 'tiktok', name: 'TikTok', icon: SiTiktok, color: 'text-slate-300' },
    { id: 'instagram', name: 'Instagram', icon: FiInstagram, color: 'text-pink-400' },
    { id: 'facebook', name: 'Facebook', icon: SiFacebook, color: 'text-blue-400' },
  ]

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024 * 1024) {
        toast.error('File size must be less than 5GB')
        return
      }
      setVideoFile(file)
      toast.success(`${file.name} selected`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFile) {
      toast.error('Please select a video file')
      return
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIsUploading(true)

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          video_url: '/mock-video.mp4',
          thumbnail_url: '/mock-thumbnail.jpg',
          scheduled_time: formData.scheduledTime || new Date().toISOString(),
          platforms: selectedPlatforms,
          status: (formData.scheduledTime ? 'scheduled' : 'published'),
        }),
      })

      if (!res.ok) throw new Error('Failed to create video')
      
      const { video } = await res.json()
      addVideo(video)

      toast.success(
        `Video ${formData.scheduledTime ? 'scheduled' : 'published'} successfully!`
      )

      // Reset form
      setFormData({ title: '', description: '', scheduledTime: '' })
      setVideoFile(null)
      selectedPlatforms.forEach((p) => togglePlatform(p))
    } catch (error) {
      toast.error('Failed to upload video')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <h1 className="text-4xl font-bold font-space">Upload Video</h1>
        <p className="text-slate-400">
          Upload a video and schedule it to post across multiple platforms
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Video Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-4">Video File</h2>

          <label className="block">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all"
            >
              {videoFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FiCheck className="text-2xl text-green-400" />
                  <div className="text-left">
                    <p className="font-medium">{videoFile.name}</p>
                    <p className="text-sm text-slate-400">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <FiUpload className="text-4xl text-slate-400 mx-auto" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-400">MP4, MOV, AVI up to 5GB</p>
                </div>
              )}
            </motion.div>
          </label>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card space-y-4"
        >
          <h2 className="text-xl font-bold mb-4">Video Details</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              placeholder="Enter video title"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
            />
            <p className="text-xs text-slate-400 mt-1">{formData.title.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              placeholder="Enter video description"
              className="input-field resize-none h-24"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={5000}
            />
            <p className="text-xs text-slate-400 mt-1">
              {formData.description.length}/5000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Schedule (Optional)</label>
            <input
              type="datetime-local"
              className="input-field"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-1">
              Leave empty to post immediately
            </p>
          </div>
        </motion.div>

        {/* Platform Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-4">Select Platforms</h2>

          {platformAccounts.length === 0 && (
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
              <FiAlertCircle className="text-xl text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-sm">
                No platforms connected. Go to Connections to link your accounts first.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => {
              const Icon = platform.icon
              const isConnected = platformAccounts.some(
                (acc) => acc.platform === platform.id
              )
              const isSelected = selectedPlatforms.includes(platform.id)

              return (
                <motion.button
                  key={platform.id}
                  type="button"
                  whileHover={isConnected ? { scale: 1.05 } : undefined}
                  whileTap={isConnected ? { scale: 0.95 } : undefined}
                  onClick={() => {
                    if (isConnected) togglePlatform(platform.id)
                  }}
                  disabled={!isConnected}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className={`text-2xl mx-auto mb-2 ${platform.color}`} />
                  <p className="text-sm font-medium">{platform.name}</p>
                  {!isConnected && <p className="text-xs text-slate-400 mt-1">Not connected</p>}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={!isUploading ? { scale: 1.02 } : undefined}
          whileTap={!isUploading ? { scale: 0.98 } : undefined}
          type="submit"
          disabled={isUploading || platformAccounts.length === 0}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
            isUploading
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload & Schedule'}
        </motion.button>
      </form>
    </div>
  )
}
