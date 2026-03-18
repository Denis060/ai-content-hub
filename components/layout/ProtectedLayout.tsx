'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useContentHub } from '@/lib/store'
import Navigation from './Navigation'
import Sidebar from './Sidebar'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, setUser, isLoading, setLoading } = useContentHub()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const supabase = createSupabaseBrowserClient()

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
          })
        } else {
          if (pathname !== '/login') {
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Auth error:', error)
        if (pathname !== '/login') {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes (e.g., successful login)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setLoading, router, pathname])

  if (!mounted || isLoading) {
    return <LoadingScreen />
  }

  if (!user && pathname !== '/login') {
    return null
  }

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navigation />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
