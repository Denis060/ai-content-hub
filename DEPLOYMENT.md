# AI Content Hub - Complete Setup & Deployment Guide

## Phase 1: Local Development Setup (15 minutes)

### 1.1 Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git installed
- A GitHub account (for deploying to Vercel)

### 1.2 Initial Setup

```bash
# Clone or create the project
mkdir ai-content-hub
cd ai-content-hub

# Initialize git
git init

# Create .env.local file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see your app running.

---

## Phase 2: Supabase Setup (10 minutes)

### 2.1 Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Name: `ai-content-hub`
5. Region: Choose closest to you
6. Password: Save securely
7. Click "Create new project" (wait 2-3 minutes)

### 2.2 Get Your Credentials

Once project is created:
1. Go to Settings → API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update `.env.local` with these values

### 2.3 Create Database Tables

Go to Supabase SQL Editor and run:

```sql
-- Users table (managed by Supabase Auth)

-- Platform Accounts table
CREATE TABLE platform_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  platform VARCHAR(50) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  platform_user_id VARCHAR(255) NOT NULL,
  connected_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, platform, platform_user_id)
);

-- Scheduled Videos table
CREATE TABLE scheduled_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  scheduled_time TIMESTAMP NOT NULL,
  platforms TEXT[] NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now(),
  published_at TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  platform VARCHAR(50) NOT NULL,
  video_id VARCHAR(255) NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  watch_time INTEGER DEFAULT 0,
  engagement_rate FLOAT DEFAULT 0,
  fetched_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE platform_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own platform accounts"
ON platform_accounts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform accounts"
ON platform_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform accounts"
ON platform_accounts FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for scheduled_videos and analytics...
```

### 2.4 Enable Authentication

1. Go to Supabase Dashboard → Authentication
2. Providers → Email
3. Enable "Email" provider
4. Go to Auth Settings
5. Confirm Email settings if needed

---

## Phase 3: Deploy to Vercel (5 minutes)

### 3.1 Push to GitHub

```bash
# Create .gitignore
echo "node_modules/
.env.local
.next/
out/
dist/
.DS_Store" > .gitignore

# Commit and push
git add .
git commit -m "Initial commit: AI Content Hub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-content-hub.git
git push -u origin main
```

### 3.2 Deploy on Vercel

1. Go to https://vercel.com
2. Sign up / Log in with GitHub
3. Click "Add New Project"
4. Select your `ai-content-hub` repository
5. Vercel will auto-detect Next.js
6. Click "Environment Variables"
7. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
8. Click "Deploy"

**Your app is now live!** 🎉

Access it at: `https://your-project.vercel.app`

---

## Phase 4: Connect Social Platforms

### 4.1 YouTube Connection

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create new project: `AI Content Hub`
3. Enable YouTube Data API v3
4. Create OAuth 2.0 Client ID (Desktop app)
5. Download credentials
6. In your app:
   - Settings → YouTube
   - Paste Client ID
   - Click "Connect YouTube"
   - Grant permissions
   - Account connected ✓

### 4.2 TikTok Connection

1. Go to TikTok Developer: https://developer.tiktok.com
2. Create app
3. Get Client ID and Secret
4. In your app:
   - Settings → TikTok
   - Paste credentials
   - Click "Connect TikTok"
   - Grant permissions
   - Account connected ✓

### 4.3 Instagram Connection

1. Go to Meta for Developers: https://developers.facebook.com
2. Create app
3. Set up Instagram Graph API
4. Get access tokens
5. In your app:
   - Settings → Instagram
   - Connect Business Account
   - Account connected ✓

### 4.4 Facebook Connection

1. Same Meta Developer account
2. Set up Facebook Graph API
3. Get access tokens
4. In your app:
   - Settings → Facebook
   - Connect Business Page
   - Account connected ✓

---

## Phase 5: First Upload Test

### 5.1 Test the System

1. Go to Dashboard
2. Click "+ New Video"
3. Upload test video file
4. Fill in title and description
5. Select all platforms
6. Click "Upload & Schedule"
7. Check Dashboard → Recent Videos

**Video is now queued across all platforms!**

### 5.2 Verify Posting

- YouTube: Check channel (may take 5-10 min to appear)
- TikTok: Check account
- Instagram: Check Reels
- Facebook: Check Page

---

## API Integration Details

### YouTube Posting API

```typescript
// app/api/platforms/youtube/upload.ts
import { google } from 'googleapis'

export async function uploadToYouTube(
  videoUrl: string,
  metadata: {
    title: string
    description: string
    tags: string[]
  }
) {
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  })

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
      },
      status: {
        privacyStatus: 'public',
      },
    },
    media: {
      body: fs.createReadStream(videoUrl),
    },
  })

  return response.data.id
}
```

### TikTok Posting API

```typescript
// app/api/platforms/tiktok/upload.ts
export async function uploadToTikTok(
  videoUrl: string,
  metadata: {
    title: string
    description: string
  }
) {
  const formData = new FormData()
  formData.append('video', fs.createReadStream(videoUrl))
  formData.append('title', metadata.title)
  formData.append('description', metadata.description)

  const response = await fetch(
    'https://open.tiktokapis.com/v1/video/upload/?access_token=' + accessToken,
    {
      method: 'POST',
      body: formData,
    }
  )

  return await response.json()
}
```

### Instagram Posting API

```typescript
// app/api/platforms/instagram/upload.ts
export async function uploadToInstagram(
  videoUrl: string,
  metadata: {
    caption: string
  }
) {
  const response = await fetch(
    `https://graph.instagram.com/v18.0/${businessAccountId}/media`,
    {
      method: 'POST',
      body: JSON.stringify({
        media_type: 'REELS',
        video_url: videoUrl,
        caption: metadata.caption,
        access_token: accessToken,
      }),
    }
  )

  return await response.json()
}
```

### Facebook Posting API

```typescript
// app/api/platforms/facebook/upload.ts
export async function uploadToFacebook(
  videoUrl: string,
  metadata: {
    title: string
    description: string
  }
) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/videos`,
    {
      method: 'POST',
      body: JSON.stringify({
        source: videoUrl,
        title: metadata.title,
        description: metadata.description,
        access_token: accessToken,
      }),
    }
  )

  return await response.json()
}
```

---

## Monitoring & Analytics

### Real-Time Analytics

Analytics automatically pull from each platform API:

```typescript
// app/api/analytics/fetch.ts
export async function fetchAnalytics(videoId: string, platform: string) {
  if (platform === 'youtube') {
    // Use YouTube Analytics API
    const views = await getYouTubeViews(videoId)
    const likes = await getYouTubeLikes(videoId)
    // ...store in Supabase
  }

  if (platform === 'tiktok') {
    // Use TikTok Analytics API
    const views = await getTikTokViews(videoId)
    // ...store in Supabase
  }

  // Similar for Instagram, Facebook...
}
```

---

## Troubleshooting

### Issue: "Supabase connection error"
**Solution:** Check `.env.local` has correct URL and key. Restart dev server.

### Issue: "Video upload fails"
**Solution:** Check file size (<5GB), format (MP4/MOV), and platform quotas.

### Issue: "OAuth connection fails"
**Solution:** Verify Client ID/Secret match platform settings. Check redirect URIs.

### Issue: "Videos not appearing on platform"
**Solution:** Check platform policies. May take 5-15 min to appear. Verify metadata compliance.

---

## Monthly Costs (at scale)

| Service | Cost | Usage |
|---------|------|-------|
| Supabase | Free-$25 | 500MB storage, unlimited queries |
| Vercel | Free-$20 | Serverless functions |
| Video Storage | $0 | Use platform's native storage |
| APIs | Free | Native platform APIs |
| **Total** | **Free-$45/mo** | Full production system |

---

## Next Steps

1. **Test the full flow:** Upload → Post → Verify
2. **Integrate AI content generation:** Use ChatGPT/Gemini APIs to auto-generate scripts
3. **Add scheduling jobs:** Use BullMQ or Vercel Cron for automated posting
4. **Build notification system:** Email/Slack alerts for new analytics
5. **Create analytics dashboard:** Advanced charts and insights
6. **Add team management:** Multiple users, roles, permissions

---

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- YouTube API: https://developers.google.com/youtube/v3
- TikTok API: https://developers.tiktok.com
- Meta/Instagram API: https://developers.facebook.com

**You're ready to deploy! 🚀**
