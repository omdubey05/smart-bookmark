'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    const handleLogin = async () => {

      // ✅ IMPORTANT — process OAuth response
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )

      if (!error) {
        router.replace('/dashboard')
      } else {
        router.replace('/')
      }
    }

    handleLogin()
  }, [router])

  return <p>Logging you in...</p>
}
