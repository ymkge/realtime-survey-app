'use client'

import { createPoll } from '@/app/dashboard/create/actions'
import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'

const initialState = {
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      disabled={pending}
    >
      {pending ? 'Creating...' : 'Create Poll'}
    </button>
  )
}

export default function PollForm() {
  const [state, formAction] = useActionState(createPoll, initialState)
  const [options, setOptions] = useState(['', ''])

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  return (
    <form action={formAction} className="max-w-lg mx-auto bg-card p-8 rounded-xl shadow-custom-lg border border-border">
      <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Create a New Poll</h2>
      
      <div className="mb-6">
        <label htmlFor="title" className="block text-foreground font-bold mb-2">
          Poll Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-foreground font-bold mb-2">Options</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                name="options[]"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Option ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20"
                disabled={options.length <= 2}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddOption}
          className="mt-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          + Add Option
        </button>
      </div>

      {state?.error && (
        <p className="text-destructive mb-4 text-center">{state.error}</p>
      )}

      <div className="text-right mt-8">
        <SubmitButton />
      </div>
    </form>
  )
}

