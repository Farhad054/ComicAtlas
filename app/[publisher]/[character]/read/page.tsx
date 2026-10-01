'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

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

export default function ReadingPathPage() {
  const params = useParams()
  const [paths, setPaths] = useState<ReadingPath[]>([])
  const [activeTier, setActiveTier] = useState<Tier>('beginner')
  const [readIssues, setReadIssues] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/reading-path?publisher=${params.publisher}&character=${params.character}`)
      const data = await res.json()
      setPaths(data.paths ?? [])

      const progressRes = await fetch('/api/progress')
      const progressData = await progressRes.json()
      setReadIssues(new Set(progressData))
      setLoading(false)
    }
    load()
  }, [params])

  const activePath = paths.find((p) => p.tier === activeTier)

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
    beginner: { label: 'Beginner', color: 'green', desc: 'Best entry points — minimal context required' },
    essential: { label: 'Essential', color: 'yellow', desc: 'The must-reads that define this character' },
    complete: { label: 'Complete', color: 'purple', desc: 'The full story, cover to cover' },
  }

  const firstUnread = activePath?.nodes.find((n) => !readIssues.has(n.issueId))

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">
        Loading reading path...
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-sm text-gray-400 mb-1">Reading Path</div>
        <h1 className="text-3xl font-black capitalize">{String(params.character).replace(/-/g, ' ')}</h1>
      </div>

      {/* Tier Switcher */}
      <div className="flex gap-3 mb-8 p-1 bg-gray-900 rounded-xl border border-gray-800">
        {(Object.entries(tierConfig) as [Tier, typeof tierConfig[Tier]][]).map(([tier, config]) => (
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
        ))}
      </div>

      <div className="text-sm text-gray-400 mb-6">{tierConfig[activeTier].desc}</div>

      {/* Path Nodes */}
      {activePath ? (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800" />
          <div className="space-y-4">
            {activePath.nodes.map((node) => {
              const isRead = readIssues.has(node.issueId)
              const isNext = node.id === firstUnread?.id

              return (
                <div key={node.id} className="relative flex gap-4 pl-14">
                  {/* Connector dot */}
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
                      {/* Cover placeholder */}
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
  )
}
