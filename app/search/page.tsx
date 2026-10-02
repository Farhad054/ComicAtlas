import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? '').trim()
  const lower = query.toLowerCase()

  let characters: {
    id: string; name: string; realName: string | null; imageUrl: string | null;
    publisherSlug: string; slug: string
  }[] = []
  let events: { id: string; name: string; publisherSlug: string }[] = []

  if (query.length >= 2) {
    const [allChars, allEvents] = await Promise.all([
      prisma.character.findMany({ include: { publisher: { select: { slug: true } } } }),
      prisma.event.findMany({ include: { publisher: { select: { slug: true } } } }),
    ])

    characters = allChars
      .filter((c) => {
        const aliases: string[] = JSON.parse(c.aliases)
        return (
          c.name.toLowerCase().includes(lower) ||
          (c.realName ?? '').toLowerCase().includes(lower) ||
          aliases.some((a) => a.toLowerCase().includes(lower))
        )
      })
      .map((c) => ({
        id: c.id, name: c.name, realName: c.realName, imageUrl: c.imageUrl,
        publisherSlug: c.publisher.slug,
        slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }))

    events = allEvents
      .filter((e) => e.name.toLowerCase().includes(lower))
      .map((e) => ({ id: e.id, name: e.name, publisherSlug: e.publisher.slug }))
  }

  const total = characters.length + events.length

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {query ? (
        <>
          <h1 className="text-3xl font-black mb-1">Search results</h1>
          <p className="text-gray-400 mb-8">
            {total === 0 ? `No results for "${query}"` : `${total} result${total !== 1 ? 's' : ''} for "${query}"`}
          </p>

          {characters.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Characters</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {characters.map((c) => (
                  <Link
                    key={c.id}
                    href={`/${c.publisherSlug}/${c.slug}`}
                    className={`flex items-center gap-4 bg-gray-900 border rounded-xl p-4 hover:scale-[1.02] transition-all ${
                      c.publisherSlug === 'marvel' ? 'border-gray-800 hover:border-red-600' : 'border-gray-800 hover:border-blue-600'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-800 flex items-center justify-center">
                      {c.imageUrl
                        ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                        : <span className={`text-lg font-black ${c.publisherSlug === 'marvel' ? 'text-red-700' : 'text-blue-700'}`}>{c.name.charAt(0)}</span>
                      }
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-base">{c.name}</div>
                      {c.realName && <div className="text-gray-400 text-sm">{c.realName}</div>}
                    </div>
                    <span className={`text-xs font-bold uppercase ${c.publisherSlug === 'marvel' ? 'text-red-500' : 'text-blue-400'}`}>
                      {c.publisherSlug}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {events.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Events</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {events.map((e) => (
                  <Link
                    key={e.id}
                    href={`/events/${e.id}`}
                    className={`flex items-center gap-4 bg-gray-900 border rounded-xl p-4 hover:scale-[1.02] transition-all ${
                      e.publisherSlug === 'marvel' ? 'border-gray-800 hover:border-red-600' : 'border-gray-800 hover:border-blue-600'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 text-xl">★</span>
                    </div>
                    <div className="flex-1 font-black text-base">{e.name}</div>
                    <span className={`text-xs font-bold uppercase ${e.publisherSlug === 'marvel' ? 'text-red-500' : 'text-blue-400'}`}>
                      {e.publisherSlug}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {total === 0 && query.length >= 2 && (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-3">⌕</div>
              <p>Try searching for a character name, alias, or event.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['Spider-Man', 'Batman', 'Civil War', 'Logan', 'Bruce Wayne'].map((s) => (
                  <Link key={s} href={`/search?q=${encodeURIComponent(s)}`}
                    className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-gray-700 transition-colors">
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h1 className="text-3xl font-black mb-3">Search ComicAtlas</h1>
          <p className="text-gray-400 mb-6">Find characters by name, alias, or real name — and major events.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Spider-Man', 'Batman', 'Civil War', 'Logan', 'Bruce Wayne', 'Infinity Gauntlet'].map((s) => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`}
                className="bg-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors">
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
