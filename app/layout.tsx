import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ProtectedLayout from '@/components/layout/ProtectedLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })

export const metadata: Metadata = {
  title: 'AI Content Hub - Multi-Platform Automation',
  description: 'Automate your content across YouTube, TikTok, Instagram, and Facebook',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <ProtectedLayout>
          {children}
        </ProtectedLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
