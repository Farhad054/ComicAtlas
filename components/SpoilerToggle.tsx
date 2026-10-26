'use client'

import { useOptimistic, useTransition } from 'react'
import { setSpoilerProtection } from '@/app/actions/spoiler'

interface SpoilerToggleProps {
  protect: boolean
}

export function SpoilerToggle({ protect }: SpoilerToggleProps) {
  const [isPending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(protect)

  const toggle = () => {
    const next = !optimistic
    startTransition(async () => {
      setOptimistic(next)
      await setSpoilerProtection(next)
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={optimistic}
      aria-label={optimistic ? 'Spoilers Hidden' : 'Spoilers Visible'}
      disabled={isPending}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
        optimistic ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <span>{optimistic ? '🔒' : '👁'}</span>
      <span className="hidden sm:inline">{optimistic ? 'Spoilers Hidden' : 'Spoilers Visible'}</span>
    </button>
  )
}
