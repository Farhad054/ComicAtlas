import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default async function CreatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [allCharacters, allTeams] = await Promise.all([
    prisma.character.findMany({
      include: {
        publisher: { select: { slug: true, name: true } },
        readingPaths: {
          where: { tier: 'essential' },
          include: {
            nodes: {
              orderBy: { order: 'asc' },
              take: 2,
              include: { issue: { select: { seriesName: true, issueNumber: true, year: true } } },
            },
          },
        },
      },
    }),
    prisma.team.findMany({
      include: { publisher: { select: { slug: true, name: true } } },
    }),
  ])

  // Find the creator whose slug matches
  let creatorName: string | null = null
  const creatorCharacters: typeof allCharacters = []

  for (const char of allCharacters) {
    const creators: string[] = JSON.parse(char.creators)
    for (const c of creators) {
      if (toSlug(c) === slug) {
        creatorName = c
        creatorCharacters.push(char)
        break
      }
    }
  }

  // Find teams by this creator
  const creatorTeams = allTeams.filter((t) => {
    const creators: string[] = JSON.parse(t.creators)
    return creators.some((c) => toSlug(c) === slug)
  })

  if (!creatorName) {
    // Maybe they only have teams
    for (const team of allTeams) {
      const creators: string[] = JSON.parse(team.creators)
      for (const c of creators) {
        if (toSlug(c) === slug) {
          creatorName = c
          break
        }
      }
      if (creatorName) break
    }
  }

  if (!creatorName) notFound()

  const marvelChars = creatorCharacters.filter((c) => c.publisher.slug === 'marvel')
  const dcChars = creatorCharacters.filter((c) => c.publisher.slug === 'dc')
  const marvelTeams = creatorTeams.filter((t) => t.publisher.slug === 'marvel')
  const dcTeams = creatorTeams.filter((t) => t.publisher.slug === 'dc')
  const totalItems = creatorCharacters.length + creatorTeams.length

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-2 text-sm text-gray-500">
        <Link href="/creators" className="hover:text-white transition-colors">Creators</Link>
        <span className="mx-2">›</span>
        <span>{creatorName}</span>
      </div>

      <h1 className="text-4xl font-black mb-2">{creatorName}</h1>
      <p className="text-gray-400 mb-10">
        {totalItems} character{totalItems !== 1 ? 's' : ''} &amp; teams in ComicAtlas
      </p>

      {[{ label: 'Marvel', chars: marvelChars, color: 'red' }, { label: 'DC', chars: dcChars, color: 'blue' }]
        .filter((section) => section.chars.length > 0)
        .map((section) => (
          <section key={section.label} className="mb-12">
            <div className={`text-sm font-black uppercase tracking-wider mb-4 ${section.color === 'red' ? 'text-red-500' : 'text-blue-400'}`}>
              {section.label}
            </div>
            <div className="space-y-4">
              {section.chars.map((char) => {
                const charSlug = char.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                const essentialPath = char.readingPaths[0]
                return (
                  <div key={char.id} className={`bg-gray-900 border rounded-xl overflow-hidden ${section.color === 'red' ? 'border-gray-800 hover:border-red-800' : 'border-gray-800 hover:border-blue-800'} transition-colors`}>
                    <div className="flex items-start gap-4 p-5">
                      {char.imageUrl && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-gray-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Link
                          href={`/${char.publisher.slug}/${charSlug}`}
                          className={`font-black text-lg hover:underline ${section.color === 'red' ? 'hover:text-red-400' : 'hover:text-blue-400'}`}
                        >
                          {char.name}
                        </Link>
                        {char.realName && <div className="text-gray-400 text-sm">{char.realName}</div>}
                        <div className="text-gray-500 text-xs mt-1">
                          First appearance: {char.firstAppearanceIssue} {char.firstAppearanceYear ? `(${char.firstAppearanceYear})` : ''}
                        </div>
                      </div>
                      <Link
                        href={`/${char.publisher.slug}/${charSlug}/read`}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex-shrink-0 transition-all ${
                          section.color === 'red'
                            ? 'border-red-800 text-red-400 hover:bg-red-950'
                            : 'border-blue-800 text-blue-400 hover:bg-blue-950'
                        }`}
                      >
                        Read →
                      </Link>
                    </div>

                    {essentialPath && essentialPath.nodes.length > 0 && (
                      <div className="border-t border-gray-800 px-5 py-3">
                        <div className="text-xs text-gray-500 mb-2">Essential reading</div>
                        <div className="flex flex-wrap gap-2">
                          {essentialPath.nodes.map((node) => (
                            <span key={node.id} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                              {node.issue.seriesName} #{node.issue.issueNumber} ({node.issue.year})
                            </span>
                          ))}
                          {essentialPath.nodes.length < char.readingPaths[0]?.nodes.length ? null : null}
                          <Link
                            href={`/${char.publisher.slug}/${charSlug}/read`}
                            className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1"
                          >
                            + more →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}

      {/* Teams section */}
      {creatorTeams.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-black mb-6">Teams</h2>
          {[{ label: 'Marvel', teams: marvelTeams, color: 'red' }, { label: 'DC', teams: dcTeams, color: 'blue' }]
            .filter((section) => section.teams.length > 0)
            .map((section) => (
              <div key={section.label} className="mb-8">
                <div className={`text-sm font-black uppercase tracking-wider mb-4 ${section.color === 'red' ? 'text-red-500' : 'text-blue-400'}`}>
                  {section.label}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {section.teams.map((team) => (
                    <Link
                      key={team.id}
                      href={`/teams/${team.slug}`}
                      className={`flex items-center gap-4 bg-gray-900 border rounded-xl p-4 hover:scale-[1.02] transition-all ${section.color === 'red' ? 'border-gray-800 hover:border-red-700' : 'border-gray-800 hover:border-blue-700'}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg ${section.color === 'red' ? 'bg-red-950 text-red-400' : 'bg-blue-950 text-blue-400'}`}>
                        {team.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-base">{team.name}</div>
                        {team.firstAppearanceYear && (
                          <div className="text-gray-500 text-xs">Est. {team.firstAppearanceYear}</div>
                        )}
                      </div>
                      <span className={`text-xs font-semibold ${section.color === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
                        View →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </section>
      )}
    </div>
  )
}
