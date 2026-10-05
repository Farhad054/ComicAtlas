'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Tier = 'beginner' | 'essential' | 'complete'

interface PathNode {
  id: string
  issueId: string
  whyItMatters: string
  required: boolean
  estTimeMinutes: number
  order: number
  issue: {
    id: string
    seriesName: string
    issueNumber: string
    year: number
    coverImageUrl: string | null
    summary: string | null
  }
}

interface ReadingPath {
  id: string
  tier: string
  nodes: PathNode[]
}

interface Membership {
  id: string
  displayName: string
  role: string | null
  leftNote: string | null
  characterId: string | null
  character: {
    name: string
    publisher: { slug: string }
  } | null
}

interface Lineup {
  id: string
  name: string
  years: string | null
  description: string | null
  memberDisplayNames: string
}

interface EventTeam {
  id: string
  event: {
    id: string
    name: string
    publisher: { slug: string }
  }
}

interface TeamRelationship {
  id: string
  type: string
  teamA: { id: string; name: string; slug: string }
  teamB: { id: string; name: string; slug: string }
}

interface Team {
  id: string
  name: string
  slug: string
  bio: string
  baseOfOperations: string | null
  firstAppearanceIssue: string | null
  firstAppearanceYear: number | null
  creators: string
  publisher: { slug: string; name: string }
  memberships: Membership[]
  lineups: Lineup[]
  readingPaths: ReadingPath[]
  eventTeams: EventTeam[]
  relationshipsA: TeamRelationship[]
  relationshipsB: TeamRelationship[]
}

export default function TeamPage() {
  const params = useParams()
  const slug = params.slug as string

  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTier, setActiveTier] = useState<Tier>('essential')
  const [readIssues, setReadIssues] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/teams/${slug}/reading-path`)
      if (!res.ok) { setLoading(false); return }
      const data = await res.json()
      setTeam(data.team)

      const progressRes = await fetch('/api/progress')
      const progressData = await progressRes.json()
      setReadIssues(new Set(progressData))
      setLoading(false)
    }
    load()
  }, [slug])

  const toggleRead = async (issueId: string) => {
    const newRead = !readIssues.has(issueId)
    const next = new Set(readIssues)
    if (newRead) next.add(issueId)
    else next.delete(issueId)
    setReadIssues(next)
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issueId, read: newRead }),
    })
  }

  const tierConfig = {
    beginner:  { label: 'Beginner',  color: 'green',  desc: 'Best entry points — minimal context required' },
    essential: { label: 'Essential', color: 'yellow', desc: 'The must-reads that define this team' },
    complete:  { label: 'Complete',  color: 'purple', desc: 'The full story, cover to cover' },
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-400">
        Loading team…
      </div>
    )
  }

  if (!team) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-400">
        Team not found.
      </div>
    )
  }

  const isMarvel = team.publisher.slug === 'marvel'
  const creators: string[] = JSON.parse(team.creators)
  const activePath = team.readingPaths.find((p) => p.tier === activeTier)
  const firstUnread = activePath?.nodes.find((n) => !readIssues.has(n.issueId))

  const allRelationships: { type: string; other: { id: string; name: string; slug: string } }[] = [
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
      {team.memberships.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black mb-4">Current Roster</h2>
          <div className="flex flex-wrap gap-3">
            {team.memberships.map((m) => {
              const charSlug = m.character?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
                    <div className="text-xs text-yellow-700 text-center mt-1 leading-tight italic">{m.leftNote}</div>
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
      {team.readingPaths.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black mb-4">Reading Path</h2>

          {/* Tier Switcher */}
          <div className="flex gap-3 mb-6 p-1 bg-gray-900 rounded-xl border border-gray-800">
            {(Object.entries(tierConfig) as [Tier, typeof tierConfig[Tier]][]).map(([tier, config]) => {
              const hasPath = team.readingPaths.some((p) => p.tier === tier)
              if (!hasPath) return null
              return (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTier === tier
                      ? config.color === 'green'
                        ? 'bg-green-600 text-white'
                        : config.color === 'yellow'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {config.label}
                </button>
              )
            })}
          </div>

          <div className="text-sm text-gray-400 mb-6">{tierConfig[activeTier].desc}</div>

          {activePath ? (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800" />
              <div className="space-y-4">
                {activePath.nodes.map((node) => {
                  const isRead = readIssues.has(node.issueId)
                  const isNext = node.id === firstUnread?.id
                  return (
                    <div key={node.id} className="relative flex gap-4 pl-14">
                      <div
                        className={`absolute left-4 w-4 h-4 rounded-full border-2 top-4 transition-all ${
                          isRead
                            ? 'bg-green-500 border-green-500'
                            : isNext
                            ? 'bg-yellow-500 border-yellow-500 ring-4 ring-yellow-500/30'
                            : 'bg-gray-950 border-gray-700'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-xl border p-4 transition-all ${
                          isRead
                            ? 'bg-green-950/30 border-green-900'
                            : isNext
                            ? 'bg-yellow-950/30 border-yellow-700'
                            : 'bg-gray-900 border-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-16 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                            {node.issue.coverImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={node.issue.coverImageUrl} alt={node.issue.seriesName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-1">
                                #{node.issue.issueNumber}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-semibold text-sm">{node.issue.seriesName} #{node.issue.issueNumber}</div>
                                <div className="text-gray-500 text-xs">{node.issue.year}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {!node.required && (
                                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">Optional</span>
                                )}
                                <span className="text-xs text-gray-500">~{node.estTimeMinutes}m</span>
                              </div>
                            </div>
                            <p className="text-gray-400 text-xs mt-2 italic">&quot;{node.whyItMatters}&quot;</p>
                            <button
                              onClick={() => toggleRead(node.issueId)}
                              className={`mt-3 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                                isRead
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                              }`}
                            >
                              {isRead ? '✓ Read' : 'Mark as read'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No path available for this tier yet.</div>
          )}
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
