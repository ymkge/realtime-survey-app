'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPoll(prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create a poll.' }
  }

  const title = formData.get('title') as string
  // 'options[]' という名前で送信された複数の選択肢を取得
  const options = formData.getAll('options[]').map(String).filter(o => o.trim() !== '')

  if (!title || options.length < 2) {
    return { error: 'Please provide a title and at least two options.' }
  }

  // 1. polls テーブルに新しいアンケートを挿入
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ title, user_id: user.id })
    .select()
    .single()

  if (pollError) {
    console.error('Error creating poll:', pollError)
    return { error: 'Failed to create poll.' }
  }

  // 2. options テーブルに選択肢を挿入
  const optionData = options.map(text => ({
    poll_id: poll.id,
    text,
  }))

  const { error: optionsError } = await supabase.from('options').insert(optionData)

  if (optionsError) {
    console.error('Error creating options:', optionsError)
    // TODO: ここで作成済みの poll を削除するロールバック処理を入れるのが理想的
    return { error: 'Failed to create options.' }
  }

  // ダッシュボードのキャッシュを無効化して、新しいアンケートがリストに表示されるようにする
  revalidatePath('/dashboard')
  // 作成したアンケートの詳細ページにリダイレクト
  redirect(`/poll/${poll.id}`)
}
