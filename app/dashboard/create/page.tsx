import PollForm from '@/components/PollForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CreatePollPage() {
  // 念のためサーバーサイドでも認証状態を確認
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <PollForm />
      </div>
    </div>
  )
}
