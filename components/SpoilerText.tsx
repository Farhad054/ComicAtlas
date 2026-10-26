import { HIDDEN_PLACEHOLDER, type Gated } from '@/lib/spoilers'

interface SpoilerTextProps {
  /** Output of gate(). A hidden value carries no text, so none can reach the HTML. */
  value: Gated<string>
  className?: string
}

export function SpoilerText({ value, className = '' }: SpoilerTextProps) {
  if (value.hidden) {
    return (
      <span
        data-spoiler-hidden
        className={`inline-block bg-gray-800 text-gray-500 rounded px-2 py-0.5 text-sm italic select-none ${className}`}
      >
        {HIDDEN_PLACEHOLDER}
      </span>
    )
  }
  return <span className={className}>{value.value}</span>
}
