import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: { publisher: true },
    orderBy: { name: 'asc' },
  })

  const marvelEvents = events.filter((e) => e.publisher.slug === 'marvel')
  const dcEvents = events.filter((e) => e.publisher.slug === 'dc')

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-2">Major Events</h1>
      <p className="text-gray-400 mb-10">The crossover events that changed everything.</p>

      {marvelEvents.length > 0 && (
        <section className="mb-12">
          <div className="text-red-500 font-black text-sm uppercase tracking-wider mb-4">Marvel</div>
          <div className="grid gap-4 md:grid-cols-2">
            {marvelEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}
                className="group bg-gray-900 border border-gray-800 hover:border-red-700 rounded-xl p-5 transition-all">
                <div className="font-black text-lg group-hover:text-red-400 transition-colors mb-1">{event.name}</div>
                <div className="text-gray-400 text-sm line-clamp-2">{event.summary.slice(0, 120)}...</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {dcEvents.length > 0 && (
        <section>
          <div className="text-blue-400 font-black text-sm uppercase tracking-wider mb-4">DC</div>
          <div className="grid gap-4 md:grid-cols-2">
            {dcEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}
                className="group bg-gray-900 border border-gray-800 hover:border-blue-700 rounded-xl p-5 transition-all">
                <div className="font-black text-lg group-hover:text-blue-400 transition-colors mb-1">{event.name}</div>
                <div className="text-gray-400 text-sm line-clamp-2">{event.summary.slice(0, 120)}...</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
