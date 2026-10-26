'use client'

import Link from 'next/link'
import { useOptimistic, useTransition } from 'react'
import { setIssueRead } from '@/app/actions/spoiler'

interface ReadToggleProps {
  issueId: string
  isRead: boolean
  signedIn: boolean
}

export function ReadToggle({ issueId, isRead, signedIn }: ReadToggleProps) {
  const [isPending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(isRead)

  if (!signedIn) {
    return (
      <Link
        href="/login"
        className="mt-3 inline-block text-xs px-3 py-1.5 rounded-full font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
      >
        Sign in to track progress
      </Link>
    )
  }

  const toggle = () => {
    const next = !optimistic
    startTransition(async () => {
      setOptimistic(next)
      await setIssueRead(issueId, next)
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={`mt-3 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
        optimistic ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {optimistic ? '✓ Read' : 'Mark as read'}
    </button>
  )
}
