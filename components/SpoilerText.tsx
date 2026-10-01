'use client'

interface SpoilerTextProps {
  text: string
  spoilerMode: boolean
  className?: string
}

export function SpoilerText({ text, spoilerMode, className }: SpoilerTextProps) {
  if (spoilerMode) {
    return (
      <span className={`inline-block bg-gray-800 text-gray-500 rounded px-2 py-0.5 text-sm italic select-none ${className}`}>
        Hidden until you&apos;ve read further
      </span>
    )
  }
  return <span className={className}>{text}</span>
}
