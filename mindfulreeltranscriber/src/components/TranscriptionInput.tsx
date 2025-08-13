'use client'

import { useState } from 'react'

interface TranscriptionInputProps {
  onSubmit: (videoUrl: string, scrollLimit: number) => void
  loading: boolean
}

export default function TranscriptionInput({ onSubmit, loading }: TranscriptionInputProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [scrollLimit, setScrollLimit] = useState(10)
  const [consent, setConsent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      alert('Please provide consent to process your video content.')
      return
    }
    if (!videoUrl.trim()) {
      alert('Please enter a valid video URL.')
      return
    }
    onSubmit(videoUrl.trim(), scrollLimit)
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
        Transcribe Your Video
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.instagram.com/reel/... or https://youtube.com/shorts/..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Paste a public video URL from Instagram, YouTube, or other platforms
          </p>
        </div>

        <div>
          <label htmlFor="scrollLimit" className="block text-sm font-medium text-gray-700 mb-2">
            Scroll Limit
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="scrollLimit"
              type="range"
              min="5"
              max="50"
              value={scrollLimit}
              onChange={(e) => setScrollLimit(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
              {scrollLimit} scrolls
            </span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>5 scrolls</span>
            <span>50 scrolls</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Set a limit to promote mindful consumption
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            I consent to the transcription and processing of the video content I provide. 
            I understand that only transcriptions and metadata will be stored, not the original video content. 
            I acknowledge that I am responsible for ensuring the content is appropriate and that I have the right to process it.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !consent || !isValidUrl(videoUrl)}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Transcribing...
            </div>
          ) : (
            'Start Transcription'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How it works:</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Paste a public video URL from any platform</li>
          <li>• Set your scroll limit to control consumption</li>
          <li>• Get a text transcription to read instead of watching</li>
          <li>• Click on snippets to view the original video if needed</li>
        </ul>
      </div>
    </div>
  )
}

