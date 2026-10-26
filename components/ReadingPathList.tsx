import Link from 'next/link'
import { SpoilerText } from '@/components/SpoilerText'
import { ReadToggle } from '@/components/ReadToggle'
import type { Gated } from '@/lib/spoilers'

export type Tier = 'beginner' | 'essential' | 'complete'

export const TIER_CONFIG: Record<Tier, { label: string; active: string; desc: string }> = {
  beginner: { label: 'Beginner', active: 'bg-green-600 text-white', desc: 'Best entry points — minimal context required' },
  essential: { label: 'Essential', active: 'bg-yellow-500 text-black', desc: 'The must-reads that define this character' },
  complete: { label: 'Complete', active: 'bg-purple-600 text-white', desc: 'The full story, cover to cover' },
}

export function parseTier(value: string | undefined, fallback: Tier): Tier {
  return value === 'beginner' || value === 'essential' || value === 'complete' ? value : fallback
}

export interface PathNodeView {
  id: string
  issueId: string
  required: boolean
  estTimeMinutes: number
  whyItMatters: Gated<string>
  issue: { seriesName: string; issueNumber: string; year: number; coverImageUrl: string | null }
}

export function TierSwitcher({ basePath, active, available }: { basePath: string; active: Tier; available: Tier[] }) {
  return (
    <div className="flex gap-3 p-1 bg-gray-900 rounded-xl border border-gray-800">
      {(Object.keys(TIER_CONFIG) as Tier[])
        .filter((t) => available.includes(t))
        .map((tier) => (
          <Link
            key={tier}
            href={`${basePath}?tier=${tier}`}
            scroll={false}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold text-center transition-all ${
              active === tier ? TIER_CONFIG[tier].active : 'text-gray-400 hover:text-white'
            }`}
          >
            {TIER_CONFIG[tier].label}
          </Link>
        ))}
    </div>
  )
}

export function ReadingPathList({
  nodes,
  readIssueIds,
  signedIn,
}: {
  nodes: PathNodeView[]
  readIssueIds: ReadonlySet<string>
  signedIn: boolean
}) {
  if (nodes.length === 0) {
    return <div className="text-center text-gray-500 py-8">No path available for this tier yet.</div>
  }
  const firstUnread = nodes.find((n) => !readIssueIds.has(n.issueId))

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800" />
      <div className="space-y-4">
        {nodes.map((node) => {
          const isRead = readIssueIds.has(node.issueId)
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
                        <div className="font-semibold text-sm">
                          {node.issue.seriesName} #{node.issue.issueNumber}
                        </div>
                        <div className="text-gray-500 text-xs">{node.issue.year}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!node.required && (
                          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">Optional</span>
                        )}
                        <span className="text-xs text-gray-500">~{node.estTimeMinutes}m</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 italic">
                      <SpoilerText value={node.whyItMatters} />
                    </p>
                    <ReadToggle issueId={node.issueId} isRead={isRead} signedIn={signedIn} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
