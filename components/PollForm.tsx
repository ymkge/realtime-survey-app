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
      className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 disabled:opacity-50"
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
    <form action={formAction} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create a New Poll</h2>
      
      <div className="mb-6">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Poll Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Options</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                name="options[]"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 text-sm"
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
          className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
        >
          + Add Option
        </button>
      </div>

      {state?.error && (
        <p className="text-red-500 mb-4 text-center">{state.error}</p>
      )}

      <div className="text-right mt-8">
        <SubmitButton />
      </div>
    </form>
  )
}

