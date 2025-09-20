import PollCard, { type Poll } from './PollCard'

export default function PollList({ polls }: { polls: Poll[] | null }) {
  if (!polls || polls.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <h3 className="text-lg font-semibold">No polls yet!</h3>
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
