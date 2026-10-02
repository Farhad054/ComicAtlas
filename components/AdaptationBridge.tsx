import Link from 'next/link'

interface Adaptation {
  title: string
  year: number
  type: 'Film' | 'Animated' | 'Series'
  platform: string
  hook: string
  readingTier: 'beginner' | 'essential' | 'complete'
  readingLabel: string
}

const ADAPTATIONS: Record<string, Adaptation[]> = {
  'spider-man': [
    {
      title: "Sam Raimi's Spider-Man trilogy",
      year: 2002,
      type: 'Film',
      platform: 'Netflix / Digital',
      hook: 'Origin faithfully drawn from the classic Lee/Ditko run.',
      readingTier: 'beginner',
      readingLabel: 'Start with Amazing Fantasy #15',
    },
    {
      title: 'Spider-Man: Into the Spider-Verse',
      year: 2018,
      type: 'Animated',
      platform: 'Netflix',
      hook: 'Inspired by the Miles Morales comics — a love letter to every Spider-Man.',
      readingTier: 'essential',
      readingLabel: 'Read the Essential path for the Gwen & Peter dynamic',
    },
    {
      title: 'Spider-Man: No Way Home',
      year: 2021,
      type: 'Film',
      platform: 'Disney+',
      hook: 'The multiverse payoff — pulls from decades of comic lore.',
      readingTier: 'complete',
      readingLabel: "Complete path covers the history No Way Home draws from",
    },
  ],
  'batman': [
    {
      title: "The Dark Knight trilogy",
      year: 2005,
      type: 'Film',
      platform: 'Max / Digital',
      hook: "Nolan's films are basically Year One and The Long Halloween distilled into cinema.",
      readingTier: 'beginner',
      readingLabel: 'Start with Year One — the source material',
    },
    {
      title: 'Batman: The Animated Series',
      year: 1992,
      type: 'Animated',
      platform: 'Max',
      hook: "The definitive Batman outside comics. Paul Dini's run influenced an entire generation.",
      readingTier: 'essential',
      readingLabel: 'Essential path matches the show\'s best arcs',
    },
    {
      title: 'The Batman (Matt Reeves)',
      year: 2022,
      type: 'Film',
      platform: 'Max',
      hook: "Year Two Batman, heavy noir. Directly inspired by Year One and The Long Halloween.",
      readingTier: 'essential',
      readingLabel: 'Long Halloween is the closest comic equivalent',
    },
  ],
}

interface AdaptationBridgeProps {
  characterSlug: string
  publisherSlug: string
}

export function AdaptationBridge({ characterSlug, publisherSlug }: AdaptationBridgeProps) {
  const adaptations = ADAPTATIONS[characterSlug]
  if (!adaptations) return null

  const isMarvel = publisherSlug === 'marvel'

  return (
    <div className="mb-8">
      <h2 className="text-xl font-black mb-1">Came from a film or show?</h2>
      <p className="text-gray-400 text-sm mb-4">We'll map what you've seen to where you should start reading.</p>

      <div className="grid gap-3 sm:grid-cols-3">
        {adaptations.map((ad) => (
          <div
            key={ad.title}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-sm leading-tight">{ad.title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{ad.year} · {ad.type} · {ad.platform}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                ad.type === 'Film' ? 'bg-purple-900 text-purple-300' :
                ad.type === 'Animated' ? 'bg-orange-900 text-orange-300' :
                'bg-cyan-900 text-cyan-300'
              }`}>
                {ad.type}
              </span>
            </div>

            <p className="text-gray-400 text-xs italic flex-1">"{ad.hook}"</p>

            <Link
              href={`/${publisherSlug}/${characterSlug}/read`}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg text-center transition-all ${
                isMarvel
                  ? 'bg-red-950 text-red-300 hover:bg-red-900 border border-red-900'
                  : 'bg-blue-950 text-blue-300 hover:bg-blue-900 border border-blue-900'
              }`}
            >
              {ad.readingLabel} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
