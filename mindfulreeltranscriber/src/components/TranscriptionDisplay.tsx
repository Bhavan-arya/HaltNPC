'use client'

import { useState, useEffect } from 'react'

interface TranscriptionDisplayProps {
  transcription: string
  videoUrl: string
  scrollLimit: number
  onReset: () => void
}

export default function TranscriptionDisplay({ 
  transcription, 
  videoUrl, 
  scrollLimit, 
  onReset 
}: TranscriptionDisplayProps) {
  const [scrollCount, setScrollCount] = useState(0)
  const [snippets, setSnippets] = useState<string[]>([])
  const [visibleSnippets, setVisibleSnippets] = useState<string[]>([])

  useEffect(() => {
    // Split transcription into tweet-like snippets (roughly 280 characters)
    const words = transcription.split(' ')
    const newSnippets: string[] = []
    let currentSnippet = ''

    for (const word of words) {
      if (currentSnippet.length + word.length + 1 <= 280) {
        currentSnippet += (currentSnippet ? ' ' : '') + word
      } else {
        if (currentSnippet) {
          newSnippets.push(currentSnippet)
        }
        currentSnippet = word
      }
    }
    
    if (currentSnippet) {
      newSnippets.push(currentSnippet)
    }

    setSnippets(newSnippets)
    setVisibleSnippets(newSnippets.slice(0, 1)) // Start with first snippet
    setScrollCount(0)
  }, [transcription])

  const handleScroll = () => {
    if (scrollCount < scrollLimit && visibleSnippets.length < snippets.length) {
      const nextIndex = visibleSnippets.length
      setVisibleSnippets(prev => [...prev, snippets[nextIndex]])
      setScrollCount(prev => prev + 1)
    }
  }

  const handleSnippetClick = (snippet: string) => {
    window.open(videoUrl, '_blank')
  }

  const handleShare = () => {
    const textToShare = visibleSnippets.join('\n\n')
    if (navigator.share) {
      navigator.share({
        title: 'Video Transcription',
        text: textToShare,
      })
    } else {
      navigator.clipboard.writeText(textToShare)
      alert('Transcription copied to clipboard!')
    }
  }

  const remainingScrolls = scrollLimit - scrollCount
  const hasMoreContent = visibleSnippets.length < snippets.length

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transcription</h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          New Transcription
        </button>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Scrolls remaining: {remainingScrolls}</span>
          <span>Snippets: {visibleSnippets.length} / {snippets.length}</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(scrollCount / scrollLimit) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {visibleSnippets.map((snippet, index) => (
          <div
            key={index}
            onClick={() => handleSnippetClick(snippet)}
            className="p-4 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <p className="text-gray-800 leading-relaxed">{snippet}</p>
            <div className="mt-2 text-xs text-gray-500">
              Click to view original video • Snippet {index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        {hasMoreContent && remainingScrolls > 0 && (
          <button
            onClick={handleScroll}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Next Snippet ({remainingScrolls} scrolls left)
          </button>
        )}
        
        <button
          onClick={handleShare}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          Share
        </button>
        
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          View Original
        </a>
      </div>

      {!hasMoreContent && (
        <div className="mt-4 p-3 bg-green-50 rounded-md text-center">
          <p className="text-green-800 font-medium">
            🎉 You've reached the end of the transcription!
          </p>
          <p className="text-green-600 text-sm mt-1">
            Great job practicing mindful consumption.
          </p>
        </div>
      )}

      {remainingScrolls === 0 && hasMoreContent && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-md text-center">
          <p className="text-yellow-800 font-medium">
            ⏰ You've reached your scroll limit!
          </p>
          <p className="text-yellow-600 text-sm mt-1">
            Take a break or start a new transcription to continue.
          </p>
        </div>
      )}
    </div>
  )
}

