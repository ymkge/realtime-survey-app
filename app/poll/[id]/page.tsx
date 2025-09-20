import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

type PollPageProps = {
  params: {
    id: string
  }
}

export default async function PollPage({ params }: PollPageProps) {
  const supabase = createClient()
  const pollId = params.id

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
  
  // 全ての投票結果を取得
  const { data: votes } = await supabase
    .from('votes')
    .select('option_id')
    .eq('poll_id', pollId)

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 bg-white p-4 rounded-lg shadow-sm">{poll.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Poll Details (from Server)</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">{JSON.stringify(poll, null, 2)}</pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Vote</h2>
                <pre className="bg-gray-100 p-4 rounded-md text-sm">{JSON.stringify(userVote, null, 2) ?? 'Not logged in or not voted'}</pre>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">All Votes Data</h2>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">{JSON.stringify(votes, null, 2)}</pre>
            </div>
        </div>
      </div>
    </div>
  )
}
