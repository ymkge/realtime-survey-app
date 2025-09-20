import PollCard from './PollCard'
import type { Poll } from '@/types'

export default function PollList({ polls }: { polls: Poll[] | null }) {
  if (!polls || polls.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <h3 className="text-xl font-semibold text-foreground">No polls yet!</h3>
        <p className="mt-2">Click the "+ Create New Poll" button to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  )
}
