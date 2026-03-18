import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// POST - Upload video file to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('video') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: MP4, MOV, AVI, WebM' },
        { status: 400 }
      )
    }

    // Validate file size (5GB max)
    const maxSize = 5 * 1024 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5GB' }, { status: 400 })
    }

    // Generate unique file path: user_id/timestamp_filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = `${user.id}/${timestamp}_${sanitizedName}`

    // Upload to Supabase Storage "videos" bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file: ' + uploadError.message }, { status: 500 })
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(uploadData.path)

    return NextResponse.json({
      video_url: urlData.publicUrl,
      file_path: uploadData.path,
      file_name: file.name,
      file_size: file.size,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
