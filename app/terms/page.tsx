export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold font-space mb-8">Terms of Service</h1>
        
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-4 text-slate-300">
          <h2 className="text-2xl font-bold text-white mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AI Content Hub, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">2. Description of Service</h2>
          <p>
            AI Content Hub is a content management dashboard designed to assist users in uploading, scheduling, 
            and distributing video content to integrated third-party platforms.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">3. Third-Party Services</h2>
          <p>
            Our service utilizes third-party API services (such as TikTok and Google). 
            By connecting these platforms, you also agree to be bound by their respective Terms of Service and API rules. 
            We are not responsible for content removed by these third-party platforms.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">4. Limitations of Liability</h2>
          <p>
            This application is provided "as is". We shall not be held liable for any data loss, API rate limiting, 
            or failed scheduled uploads due to third-party server outages or invalid tokens.
          </p>
        </div>
      </div>
    </div>
  )
}
