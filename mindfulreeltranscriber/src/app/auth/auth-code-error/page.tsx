import Navigation from '@/components/Navigation'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
            Authentication Error
          </h2>
          <p className="text-gray-700 text-center mb-6">
            Sorry, there was an error processing your authentication. This could be due to:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 mb-6">
            <li>• An expired or invalid authentication link</li>
            <li>• A link that has already been used</li>
            <li>• A network connectivity issue</li>
          </ul>
          <div className="text-center">
            <a
              href="/auth/signin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Try Signing In Again
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

