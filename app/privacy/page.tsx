export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold font-space mb-8">Privacy Policy</h1>
        
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-4 text-slate-300">
          <h2 className="text-2xl font-bold text-white mt-8">1. Information We Collect</h2>
          <p>
            AI Content Hub accesses your social media basic profile information and OAuth access tokens 
            specifically to authenticate you and authorize video uploads to your connected channels.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">2. How We Use Your Information</h2>
          <p>
            The information collected is used strictly to provide the core functionality of the application: 
            Uploading and scheduling your video content across your personal social media platforms (e.g., YouTube, TikTok).
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">3. Data Sharing and Security</h2>
          <p>
            We do not sell, rent, or share your personal data or API access keys with any third-party marketing services. 
            All tokens are securely stored within an encrypted Supabase database.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">4. Data Deletion</h2>
          <p>
            You may disconnect your social media accounts at any time from the app dashboard, which will permanently 
            delete your corresponding OAuth access tokens from our servers.
          </p>
        </div>
      </div>
    </div>
  )
}
