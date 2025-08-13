'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import Navigation from '@/components/Navigation'

interface Transcription {
  id: string
  video_url: string
  full_transcription: string
  created_at: string
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await fetchTranscriptions()
      }
      
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchTranscriptions()
        } else {
          setTranscriptions([])
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const fetchTranscriptions = async () => {
    try {
      const response = await fetch('/api/transcriptions')
      const data = await response.json()
      
      if (data.success) {
        setTranscriptions(data.transcriptions)
      }
    } catch (error) {
      console.error('Error fetching transcriptions:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transcription?')) {
      return
    }

    setDeleting(id)
    
    try {
      const response = await fetch(`/api/transcriptions?id=${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTranscriptions(prev => prev.filter(t => t.id !== id))
      } else {
        alert('Failed to delete transcription')
      }
    } catch (error) {
      console.error('Error deleting transcription:', error)
      alert('Failed to delete transcription')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Transcription History
            </h1>
            <p className="text-gray-600 mb-8">
              Please sign in to view your transcription history.
            </p>
            <a
              href="/auth/signin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transcription History
          </h1>
          <p className="text-gray-600">
            View and manage your past video transcriptions
          </p>
        </div>

        {transcriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No transcriptions yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start by transcribing your first video!
            </p>
            <a
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Create Transcription
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {transcriptions.map((transcription) => (
              <div
                key={transcription.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Video Transcription
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(transcription.created_at)}
                    </p>
                    <a
                      href={transcription.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      View Original Video
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(transcription.id)}
                    disabled={deleting === transcription.id}
                    className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                  >
                    {deleting === transcription.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800 leading-relaxed">
                    {truncateText(transcription.full_transcription)}
                  </p>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transcription.full_transcription)
                      alert('Transcription copied to clipboard!')
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Video Transcription',
                          text: transcription.full_transcription,
                        })
                      } else {
                        navigator.clipboard.writeText(transcription.full_transcription)
                        alert('Transcription copied to clipboard!')
                      }
                    }}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

