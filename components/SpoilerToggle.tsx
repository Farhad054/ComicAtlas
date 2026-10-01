'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface SpoilerToggleProps {
  initialValue: boolean
}

export function SpoilerToggle({ initialValue }: SpoilerToggleProps) {
  const { data: session } = useSession()
  const [spoilerMode, setSpoilerMode] = useState(initialValue)

  const toggle = async () => {
    const newValue = !spoilerMode
    setSpoilerMode(newValue)
    if (session) {
      await fetch('/api/spoiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spoilerModeOn: newValue }),
      })
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        spoilerMode
          ? 'bg-yellow-500 text-black'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <span>{spoilerMode ? '🔒' : '👁'}</span>
      <span>{spoilerMode ? 'Spoilers Hidden' : 'Spoilers Visible'}</span>
    </button>
  )
}
