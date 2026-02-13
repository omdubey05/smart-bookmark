'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <button
        onClick={loginWithGoogle}
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
      >
        Sign in with Google
      </button>
    </div>
  )
}
