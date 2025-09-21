import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PollList from '@/components/PollList'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: polls } = await supabase
    .from('polls')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const handleLogout = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Realtime Survey</h1>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">{user.email}</span>
            <form action={handleLogout}>
              <button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">My Polls</h2>
            <Link href="/dashboard/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              + Create New Poll
            </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
            <PollList polls={polls} />
        </div>
      </main>
    </div>
  )
}

