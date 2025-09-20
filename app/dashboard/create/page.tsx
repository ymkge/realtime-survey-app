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
    <div className="min-h-screen bg-background py-10">
      <PollForm />
      </div>
    </div>
  )
}
