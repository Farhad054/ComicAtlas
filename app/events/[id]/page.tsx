import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SpoilerText } from '@/components/SpoilerText'
import Link from 'next/link'

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      publisher: true,
      impactEntries: { include: { character: true } },
      readingPath: {
        include: {
          nodes: {
            orderBy: { order: 'asc' },
            include: { issue: true },
          },
        },
      },
    },
  })

  if (!event) notFound()

  const session = await getServerSession(authOptions)
  let spoilerMode = false
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { spoilerModeOn: true },
    })
    spoilerMode = user?.spoilerModeOn ?? false
  }

  const isMarvel = event.publisher.slug === 'marvel'
  const coreNodes = event.readingPath?.nodes.filter((n) => n.required) ?? []
  const optionalNodes = event.readingPath?.nodes.filter((n) => !n.required) ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className={`rounded-2xl p-8 mb-8 ${isMarvel ? 'bg-gradient-to-br from-red-950 to-gray-950 border border-red-900' : 'bg-gradient-to-br from-blue-950 to-gray-950 border border-blue-900'}`}>
        <div className={`text-sm font-semibold mb-2 ${isMarvel ? 'text-red-400' : 'text-blue-400'}`}>
          {event.publisher.name} · Major Event
        </div>
        <h1 className="text-4xl font-black mb-4">{event.name}</h1>
        <p className="text-gray-300 leading-relaxed">{event.summary}</p>
        {event.cause && (
          <div className="mt-4 p-3 bg-black/30 rounded-lg border border-gray-800">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Cause: </span>
            <span className="text-sm text-gray-300">{event.cause}</span>
          </div>
        )}
      </div>

      {/* Core Reading Order */}
      {coreNodes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-black mb-4">Core Reading Order</h2>
          <div className="space-y-3">
            {coreNodes.map((node, i) => (
              <div key={node.id} className="flex gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${isMarvel ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-sm">{node.issue.seriesName} #{node.issue.issueNumber} ({node.issue.year})</div>
                  <p className="text-gray-400 text-xs mt-1 italic">&quot;{node.whyItMatters}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Tie-ins */}
      {optionalNodes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-black mb-2">Optional Tie-ins</h2>
          <p className="text-gray-500 text-sm mb-4">Not required — but they add depth.</p>
          <div className="space-y-3">
            {optionalNodes.map((node) => (
              <div key={node.id} className="flex gap-4 bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-black flex-shrink-0 text-gray-300">
                  +
                </div>
                <div>
                  <div className="font-semibold text-sm">{node.issue.seriesName} #{node.issue.issueNumber} ({node.issue.year})</div>
                  <p className="text-gray-400 text-xs mt-1 italic">&quot;{node.whyItMatters}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact Map */}
      {event.impactEntries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-black mb-4">Impact Map</h2>
          <p className="text-gray-400 text-sm mb-4">How this event changed each character.</p>
          <div className="grid gap-3 md:grid-cols-2">
            {event.impactEntries.map((entry) => (
              <div key={entry.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <Link
                  href={`/${event.publisher.slug}/${entry.character.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className={`font-semibold text-sm hover:underline ${isMarvel ? 'text-red-400' : 'text-blue-400'}`}
                >
                  {entry.character.name}
                </Link>
                <div className="mt-1">
                  <SpoilerText text={entry.consequenceText} spoilerMode={spoilerMode} className="text-gray-300 text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
