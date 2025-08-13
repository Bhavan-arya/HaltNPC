'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import Navigation from '@/components/Navigation'
import TranscriptionInput from '@/components/TranscriptionInput'
import TranscriptionDisplay from '@/components/TranscriptionDisplay'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [transcribing, setTranscribing] = useState(false)
  const [transcription, setTranscription] = useState<{
    text: string
    videoUrl: string
    scrollLimit: number
  } | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleTranscriptionSubmit = async (videoUrl: string, scrollLimit: number) => {
    if (!user) {
      alert('Please sign in to use the transcription service.')
      return
    }

    setTranscribing(true)
    
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTranscription({
          text: data.transcription.full_transcription,
          videoUrl,
          scrollLimit,
        })
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Transcription error:', error)
      alert('Failed to transcribe video. Please try again.')
    } finally {
      setTranscribing(false)
    }
  }

  const handleReset = () => {
    setTranscription(null)
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              MindfulReelTranscriber
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform video content into text for mindful consumption
            </p>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to Mindful Video Consumption
              </h2>
              <p className="text-gray-700 mb-6">
                Break free from endless scrolling and visual overload. Our app transcribes video content 
                so you can consume information through text, promoting mindful usage and reducing screen time.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Video-to-text transcription</li>
                    <li>• Scroll limits for mindful consumption</li>
                    <li>• Tweet-like snippet format</li>
                    <li>• Easy sharing and original video access</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🔒 Privacy</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Only transcriptions are stored</li>
                    <li>• No original video content saved</li>
                    <li>• User consent required</li>
                    <li>• Secure authentication</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors mr-4"
                >
                  Get Started
                </a>
                <a
                  href="/auth/signin"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Already have an account?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {transcription ? (
          <TranscriptionDisplay
            transcription={transcription.text}
            videoUrl={transcription.videoUrl}
            scrollLimit={transcription.scrollLimit}
            onReset={handleReset}
          />
        ) : (
          <TranscriptionInput
            onSubmit={handleTranscriptionSubmit}
            loading={transcribing}
          />
        )}
      </div>
    </div>
  )
}

