'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function voteOnPoll(pollId: string, optionId: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to vote.' }
  }

  // votes テーブルに挿入
  // schema.sql で (poll_id, user_id) に UNIQUE 制約をかけているため、
  // 同じユーザーが同じアンケートに2回投票しようとすると、この挿入は失敗します。
  const { error } = await supabase.from('votes').insert({
    poll_id: pollId,
    option_id: optionId,
    user_id: user.id,
  })

  if (error) {
    // UNIQUE制約違反のエラーコードは '23505'
    if (error.code === '23505') {
      return { error: 'You have already voted on this poll.' }
    }
    console.error('Error voting:', error)
    return { error: 'Failed to cast vote.' }
  }

  // 投票が成功したら、詳細ページのキャッシュを無効化してUIを更新します。
  revalidatePath(`/poll/${pollId}`)

  return { success: true }
}
