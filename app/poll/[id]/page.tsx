import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PollDetails from '@/components/PollDetails'
import Link from 'next/link'

type PollPageProps = {
  params: {
    id: string
  }
}

export default async function PollPage({ params }: PollPageProps) {
  const supabase = createClient()
  const { id: pollId } = params

  // アンケート情報を取得 (pollsテーブルと、関連するoptionsテーブル)
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select(`
      id,
      title,
      options ( id, text )
    `)
    .eq('id', pollId)
    .single()

  if (pollError || !poll) {
    notFound()
  }

  // ユーザー情報を取得
  const { data: { user } } = await supabase.auth.getUser()

  // ユーザーの投票状況を取得
  let userVote = null
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .single()
    userVote = vote
  }
  
  // 全ての投票結果を初期データとして取得
  const { data: initialVotes } = await supabase
    .from('votes')
    .select('option_id')
    .eq('poll_id', pollId)

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        {poll.title}
      </h1>
      <PollDetails 
        poll={poll}
        userVote={userVote}
        initialVotes={initialVotes || []}
        isLoggedIn={!!user}
      />
    </div>
  )
}
