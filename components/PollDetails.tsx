'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { voteOnPoll } from '@/app/poll/[id]/actions'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useRouter } from 'next/navigation'
import type { PollWithWithOptions, Vote } from '@/types'

type PollDetailsProps = {
  poll: PollWithWithOptions
  userVote: Vote | null
  initialVotes: Vote[]
  isLoggedIn: boolean
}

export default function PollDetails({ poll, userVote, initialVotes, isLoggedIn }: PollDetailsProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [currentUserVote, setCurrentUserVote] = useState(userVote)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Supabase Realtime で投票を購読
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`poll_${poll.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes', filter: `poll_id=eq.${poll.id}` },
        (payload) => {
          setVotes((currentVotes) => [...currentVotes, payload.new as Vote])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [poll.id])

  // 投票ハンドラ
  const handleVote = async (optionId: string) => {
    if (!isLoggedIn) {
      setError('Please log in to vote.')
      return
    }
    setError(null)
    
    startTransition(async () => {
        const result = await voteOnPoll(poll.id, optionId)
        if (result.error) {
            setError(result.error)
        } else {
            // サーバーアクションの revalidatePath がサーバー側のデータを更新し、
            // Next.js がページを再レンダリングするため、手動での state 更新は不要。
            // router.refresh() を呼ぶことで、サーバーコンポーネントの再フェッチをトリガーすることもできる。
            // ただし、リアルタイム購読で votes は更新されるので、currentUserVote の更新は必要
            setCurrentUserVote({ option_id: optionId });
        }
    })
  }

  // 投票結果を集計
  const voteCounts = poll.options.map(option => {
    const count = votes.filter(v => v.option_id === option.id).length
    return { name: option.text, votes: count }
  }).sort((a, b) => b.votes - a.votes) // 票数でソート

  return (
    <div className="max-w-4xl mx-auto">
      {/* 投票フォーム or 投票済みメッセージ */}
      {currentUserVote ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-8 shadow-sm">
          <p className="font-bold">Thanks for voting!</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Cast Your Vote</h3>
          <div className="space-y-3">
            {poll.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={isPending || !isLoggedIn}
                className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-blue-100 border border-gray-200 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {!isLoggedIn && <p className="text-yellow-600 mt-4 text-center">You must be logged in to vote.</p>}
        </div>
      )}

      {/* 投票結果グラフ */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Results</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={voteCounts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{fill: '#f3f4f6'}}/>
                    <Bar dataKey="votes" fill="#3b82f6" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
