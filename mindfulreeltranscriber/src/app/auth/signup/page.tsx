import Navigation from '@/components/Navigation'
import AuthForm from '@/components/AuthForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}

