import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PollList from '@/components/PollList'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

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
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card shadow-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Realtime Survey</h1>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">{user.email}</span>
            <form action={handleLogout}>
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Logout
              </button>
            </form>
            <ThemeSwitcher />
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">My Polls</h2>
            <Link href="/dashboard/create" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
              + Create New Poll
            </Link>
        </div>
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
            <PollList polls={polls} />
        </div>
      </main>
    </div>
  )
}

