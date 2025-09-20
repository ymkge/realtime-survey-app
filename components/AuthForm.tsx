'use client'

import { login, signup } from '@/app/auth/actions'
import { useState } from 'react'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      if (isLogin) {
        const result = await login(formData)
        if (result?.error) {
          setError(result.error)
        }
      } else {
        const result = await signup(formData)
        if (result?.error) {
          setError(result.error)
        } else if (result?.message) {
          setMessage(result.message)
          (e.target as HTMLFormElement).reset();
        }
      }
    } catch (e) {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <form
        className="bg-card shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4 border border-border"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-foreground text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-foreground text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-4">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-primary hover:underline cursor-pointer"
            onClick={() => {
              if (isLoading) return;
              setIsLogin(!isLogin)
              setError(null)
              setMessage(null)
            }}
          >
            {isLogin ? 'Create an account' : 'Already have an account?'}
          </a>
        </div>
        {error && <p className="mt-4 text-center text-destructive text-xs italic">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500 text-xs italic">{message}</p>}
      </form>
    </div>
  )
}
