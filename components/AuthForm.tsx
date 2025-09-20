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
        // 成功時は server action 内で redirect するので、この後のコードは実行されない
      } else {
        const result = await signup(formData)
        if (result?.error) {
          setError(result.error)
        } else if (result?.message) {
          setMessage(result.message)
          // フォームをクリアする
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
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
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
        {error && <p className="mt-4 text-center text-red-500 text-xs italic">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500 text-xs italic">{message}</p>}
      </form>
    </div>
  )
}
