import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // URLを安全に結合する
      const redirectUrl = new URL(next, request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 認証に失敗した場合はエラーメッセージと共にホームページにリダイレクト
  const errorUrl = new URL('/', request.url)
  errorUrl.searchParams.set('error', 'Sorry, authentication failed. Please try again.')
  return NextResponse.redirect(errorUrl)
}
