'use client'

import { useState } from 'react'

interface ComicImageProps {
  /** Primary image URL (from DB). Falls back if null/undefined or if it 404s. */
  src: string | null | undefined
  /** Override URL pinned manually — takes precedence over src. */
  overrideSrc?: string | null | undefined
  alt: string
  /** Classes applied to the <img> element when the image renders. */
  imgClassName?: string
  /** Classes applied to the fallback div. */
  fallbackClassName?: string
  /** Letter shown in the fallback. Defaults to first char of alt. */
  fallbackLetter?: string
  /** Controls fallback gradient colours. */
  publisherSlug?: string
  /** Extra classes on the fallback letter span. */
  letterClassName?: string
}

/**
 * Unified image component used everywhere a character, team, or issue image
 * appears. Handles three cases identically:
 *  1. src is null/undefined → placeholder
 *  2. src loads fine → <img>
 *  3. src 404s / network error → placeholder via onError
 *
 * The parent element is always responsible for sizing and clipping;
 * ComicImage fills w-full h-full in both states.
 */
export function ComicImage({
  src,
  overrideSrc,
  alt,
  imgClassName = 'w-full h-full object-cover',
  fallbackClassName = '',
  fallbackLetter,
  publisherSlug,
  letterClassName,
}: ComicImageProps) {
  const [errored, setErrored] = useState(false)

  const activeSrc = overrideSrc ?? src

  const isMarvel = publisherSlug === 'marvel'
  const letter = fallbackLetter ?? alt.charAt(0)

  const defaultGradient = isMarvel
    ? 'bg-gradient-to-br from-red-950 to-gray-900'
    : 'bg-gradient-to-br from-blue-950 to-gray-900'

  const defaultLetterColor = isMarvel ? 'text-red-800' : 'text-blue-800'

  if (activeSrc && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={activeSrc}
        alt={alt}
        className={imgClassName}
        onError={() => setErrored(true)}
      />
    )
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center select-none ${defaultGradient} ${fallbackClassName}`}
    >
      <span className={`font-black ${letterClassName ?? 'text-4xl'} ${defaultLetterColor}`}>
        {letter}
      </span>
    </div>
  )
}
