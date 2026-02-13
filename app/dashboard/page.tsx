'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Bookmark = {
  id: string
  title: string
  url: string
}

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  // ✅ Check login
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/')
      } else {
        setUser(data.user)
        fetchBookmarks(data.user.id)
      }
    }

    checkUser()
  }, [])

  // ✅ Fetch bookmarks (user specific)
  const fetchBookmarks = async (userId?: string) => {
    const { data: userData } = await supabase.auth.getUser()
    const currentUser = userId || userData.user?.id

    if (!currentUser) return

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', currentUser)
      .order('created_at', { ascending: false })

    if (!error) {
      setBookmarks(data || [])
    }
  }

  // ✅ Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return alert('Fill both fields')

    const { data: userData } = await supabase.auth.getUser()
    const currentUser = userData.user

    if (!currentUser) return alert('User not logged in')

    const { error } = await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: currentUser.id,
      },
    ])

    if (!error) {
      setTitle('')
      setUrl('')
      fetchBookmarks(currentUser.id)
    }
  }

  // ✅ Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    fetchBookmarks()
  }

  // ✅ Logout
  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // ✅ Realtime (USER SPECIFIC)
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks(user.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  if (!user)
    return <div className="p-10 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Smart Bookmark Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Add Form */}
      <div className="bg-zinc-900 p-6 rounded-xl mb-6">
        <input
          className="w-full p-2 mb-3 rounded bg-zinc-800"
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 rounded bg-zinc-800"
          placeholder="Bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={addBookmark}
          className="bg-white text-black px-4 py-2 rounded font-semibold"
        >
          Add Bookmark
        </button>
      </div>

      {/* Bookmark List */}
      <div className="space-y-4">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{b.title}</p>
              <a
                href={b.url}
                target="_blank"
                className="text-blue-400 text-sm"
              >
                {b.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
