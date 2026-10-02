import { prisma } from '@/lib/prisma'
import Link from 'next/link'

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default async function CreatorsPage() {
  const characters = await prisma.character.findMany({
    include: { publisher: { select: { slug: true } } },
  })

  // Build creator → characters map
  const creatorMap = new Map<string, typeof characters>()
  for (const char of characters) {
    const creators: string[] = JSON.parse(char.creators)
    for (const creator of creators) {
      if (!creatorMap.has(creator)) creatorMap.set(creator, [])
      creatorMap.get(creator)!.push(char)
    }
  }

  // Sort by number of characters, then name
  const sorted = [...creatorMap.entries()].sort((a, b) =>
    b[1].length - a[1].length || a[0].localeCompare(b[0])
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-2">Creators</h1>
      <p className="text-gray-400 mb-10">The writers and artists behind your favourite characters.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map(([creator, chars]) => (
          <Link
            key={creator}
            href={`/creators/${toSlug(creator)}`}
            className="group bg-gray-900 border border-gray-800 hover:border-yellow-600 rounded-xl p-5 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="font-black text-lg group-hover:text-yellow-400 transition-colors">{creator}</div>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full flex-shrink-0">
                {chars.length} character{chars.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {chars.map((c) => (
                <span key={c.id} className={`text-xs px-2 py-0.5 rounded-full ${
                  c.publisher.slug === 'marvel' ? 'bg-red-950 text-red-300' : 'bg-blue-950 text-blue-300'
                }`}>
                  {c.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
