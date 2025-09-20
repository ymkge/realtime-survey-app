import Link from 'next/link'
import type { Poll } from '@/types'

export default function PollCard({ poll }: { poll: Poll }) {
  const createdAt = new Date(poll.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Link 
      href={`/poll/${poll.id}`}
      className="block p-6 bg-card border border-border rounded-xl shadow-md hover:bg-accent transition-colors"
    >
      <h3 className="font-bold text-xl mb-2 text-card-foreground">{poll.title}</h3>
      <p className="text-sm text-muted-foreground">Created on {createdAt}</p>
    </Link>
  )
}
