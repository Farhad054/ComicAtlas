import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getViewer } from '@/lib/spoilerContext'
import { gate } from '@/lib/spoilers'
import { toSlug } from '@/lib/slug'
import { SpoilerText } from '@/components/SpoilerText'
import { ReadingPathList, TierSwitcher, parseTier, type Tier } from '@/components/ReadingPathList'

const TIER_DESC: Record<Tier, string> = {
  beginner: 'Best entry points — minimal context required',
  essential: 'The must-reads that define this team',
  complete: 'The full story, cover to cover',
}

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tier?: string }>
}) {
  const { slug } = await params
  const { tier: tierParam } = await searchParams

  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      publisher: { select: { slug: true, name: true } },
      memberships: { include: { character: { include: { publisher: { select: { slug: true } } } } } },
      lineups: { orderBy: { id: 'asc' } },
      readingPaths: { include: { nodes: { orderBy: { order: 'asc' }, include: { issue: true } } } },
      eventTeams: { include: { event: { include: { publisher: { select: { slug: true } } } } } },
      relationshipsA: { include: { teamB: { select: { id: true, name: true, slug: true } } } },
      relationshipsB: { include: { teamA: { select: { id: true, name: true, slug: true } } } },
    },
  })
  if (!team) notFound()

  const { userId, spoilers } = await getViewer()

  const availableTiers = (['beginner', 'essential', 'complete'] as Tier[]).filter((t) =>
    team.readingPaths.some((p) => p.tier === t)
  )
  const activeTier = parseTier(tierParam, availableTiers.includes('essential') ? 'essential' : availableTiers[0] ?? 'essential')
  const activePath = team.readingPaths.find((p) => p.tier === activeTier)
  const pathNodes = (activePath?.nodes ?? []).map((node) => ({
    id: node.id,
    issueId: node.issueId,
    required: node.required,
    estTimeMinutes: node.estTimeMinutes,
    whyItMatters: gate(spoilers, node, node.whyItMatters),
    issue: node.issue,
  }))
  const memberships = team.memberships.map((m) => ({
    ...m,
    leftNote: m.leftNote ? gate(spoilers, m, m.leftNote) : null,
  }))

  const creators: string[] = JSON.parse(team.creators)

  const isMarvel = team.publisher.slug === 'marvel'
  
  const allRelationships = [
    ...team.relationshipsA.map((r) => ({ type: r.type, other: r.teamB })),
    ...team.relationshipsB.map((r) => ({ type: r.type, other: r.teamA })),
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
        <span className="mx-2">›</span>
        <span>{team.name}</span>
      </div>

      {/* Hero Header */}
      <div className={`rounded-2xl overflow-hidden mb-8 ${isMarvel ? 'bg-gradient-to-br from-red-950 via-gray-950 to-gray-950 border border-red-900' : 'bg-gradient-to-br from-blue-950 via-gray-950 to-gray-950 border border-blue-900'}`}>
        <div className="p-8">
          <div className={`text-sm font-semibold mb-2 ${isMarvel ? 'text-red-400' : 'text-blue-400'}`}>
            {team.publisher.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">{team.name}</h1>
          <p className="text-gray-300 leading-relaxed max-w-3xl">{team.bio}</p>
        </div>
      </div>

      {/* Key Facts Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {team.firstAppearanceIssue && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">First Appearance</div>
            <div className="text-sm font-semibold">{team.firstAppearanceIssue}</div>
            {team.firstAppearanceYear && (
              <div className="text-xs text-gray-400">{team.firstAppearanceYear}</div>
            )}
          </div>
        )}
        {team.baseOfOperations && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Base of Operations</div>
            <div className="text-sm font-semibold">{team.baseOfOperations}</div>
          </div>
        )}
        {creators.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 col-span-2">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created By</div>
            <div className="text-sm font-semibold">{creators.join(', ')}</div>
          </div>
        )}
      </div>

      {/* Current Roster */}
      {memberships.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black mb-4">Current Roster</h2>
          <div className="flex flex-wrap gap-3">
            {memberships.map((m) => {
              const charSlug = m.character ? toSlug(m.character.name) : null
              const pubSlug = m.character?.publisher.slug
              if (m.characterId && charSlug && pubSlug) {
                return (
                  <Link
                    key={m.id}
                    href={`/${pubSlug}/${charSlug}`}
                    className={`flex flex-col items-center bg-gray-900 border rounded-xl p-4 w-32 hover:scale-105 transition-all ${isMarvel ? 'border-gray-800 hover:border-red-700' : 'border-gray-800 hover:border-blue-700'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-2 ${isMarvel ? 'bg-red-950 text-red-400' : 'bg-blue-950 text-blue-400'}`}>
                      {m.displayName.charAt(0)}
                    </div>
                    <div className="text-xs font-semibold text-center leading-tight">{m.displayName}</div>
                    {m.role && <div className="text-xs text-gray-500 text-center mt-1 leading-tight">{m.role}</div>}
                  </Link>
                )
              }
              return (
                <div
                  key={m.id}
                  className="flex flex-col items-center bg-gray-900 border border-gray-800 rounded-xl p-4 w-32"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg font-black text-gray-600 mb-2">
                    {m.displayName.charAt(0)}
                  </div>
                  <div className="text-xs font-semibold text-center text-gray-400 leading-tight">{m.displayName}</div>
                  {m.role && <div className="text-xs text-gray-600 text-center mt-1 leading-tight">{m.role}</div>}
                  {m.leftNote && (
                    <div className="text-xs text-yellow-700 text-center mt-1 leading-tight italic">
                      <SpoilerText value={m.leftNote} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Lineups */}
      {team.lineups.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black mb-4">Notable Lineups</h2>
          <div className="space-y-4">
            {team.lineups.map((lineup) => {
              const members: string[] = JSON.parse(lineup.memberDisplayNames)
              return (
                <div key={lineup.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="font-black text-base">{lineup.name}</div>
                      {lineup.years && <div className="text-gray-500 text-sm">{lineup.years}</div>}
                    </div>
                  </div>
                  {lineup.description && (
                    <p className="text-gray-400 text-sm mb-3">{lineup.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {members.map((name) => (
                      <span key={name} className={`text-xs px-2 py-1 rounded-full ${isMarvel ? 'bg-red-950 text-red-300' : 'bg-blue-950 text-blue-300'}`}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reading Path */}
      {availableTiers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black mb-4">Reading Path</h2>
          <div className="mb-6">
            <TierSwitcher basePath={`/teams/${team.slug}`} active={activeTier} available={availableTiers} />
          </div>
          <div className="text-sm text-gray-400 mb-6">{TIER_DESC[activeTier]}</div>
          <ReadingPathList nodes={pathNodes} readIssueIds={spoilers.readIssueIds} signedIn={userId !== null} />
        </div>
      )}

      {/* Related Events */}
      {team.eventTeams.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black mb-4">Related Events</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {team.eventTeams.map((et) => {
              const isPubMarvel = et.event.publisher.slug === 'marvel'
              return (
                <Link
                  key={et.id}
                  href={`/events/${et.event.id}`}
                  className={`flex items-center gap-4 bg-gray-900 border rounded-xl p-4 hover:scale-[1.02] transition-all ${isPubMarvel ? 'border-gray-800 hover:border-red-600' : 'border-gray-800 hover:border-blue-600'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-400 text-lg">★</span>
                  </div>
                  <div className="flex-1 font-black text-base">{et.event.name}</div>
                  <span className={`text-xs font-bold uppercase ${isPubMarvel ? 'text-red-500' : 'text-blue-400'}`}>
                    {et.event.publisher.slug}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Team Relationships */}
      {allRelationships.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black mb-4">Team Relationships</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {allRelationships.map((rel) => (
              <Link
                key={rel.other.id + rel.type}
                href={`/teams/${rel.other.slug}`}
                className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:scale-[1.02] transition-all"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm ${rel.type === 'ally' ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'}`}>
                  {rel.other.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{rel.other.name}</div>
                  <div className={`text-xs ${rel.type === 'ally' ? 'text-green-500' : 'text-red-400'}`}>
                    {rel.type === 'ally' ? 'Ally' : 'Rival'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
