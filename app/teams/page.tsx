import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({
    include: { publisher: true },
    orderBy: { name: 'asc' },
  })

  const marvelTeams = teams.filter((t) => t.publisher.slug === 'marvel')
  const dcTeams = teams.filter((t) => t.publisher.slug === 'dc')

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-2">Teams</h1>
      <p className="text-gray-400 mb-10">The assembled groups that changed everything.</p>

      {marvelTeams.length > 0 && (
        <section className="mb-12">
          <div className="text-red-500 font-black text-sm uppercase tracking-wider mb-4">Marvel</div>
          <div className="grid gap-4 md:grid-cols-2">
            {marvelTeams.map((team) => (
              <Link key={team.id} href={`/teams/${team.slug}`}
                className="group bg-gray-900 border border-gray-800 hover:border-red-700 rounded-xl p-5 transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-black text-lg group-hover:text-red-400 transition-colors">{team.name}</div>
                  <span className="text-xs font-bold text-red-500 uppercase flex-shrink-0">Marvel</span>
                </div>
                <div className="text-gray-400 text-sm line-clamp-2">{team.bio.slice(0, 120)}...</div>
                {team.firstAppearanceYear && (
                  <div className="text-gray-600 text-xs mt-2">Est. {team.firstAppearanceYear}</div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {dcTeams.length > 0 && (
        <section>
          <div className="text-blue-400 font-black text-sm uppercase tracking-wider mb-4">DC</div>
          <div className="grid gap-4 md:grid-cols-2">
            {dcTeams.map((team) => (
              <Link key={team.id} href={`/teams/${team.slug}`}
                className="group bg-gray-900 border border-gray-800 hover:border-blue-700 rounded-xl p-5 transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-black text-lg group-hover:text-blue-400 transition-colors">{team.name}</div>
                  <span className="text-xs font-bold text-blue-400 uppercase flex-shrink-0">DC</span>
                </div>
                <div className="text-gray-400 text-sm line-clamp-2">{team.bio.slice(0, 120)}...</div>
                {team.firstAppearanceYear && (
                  <div className="text-gray-600 text-xs mt-2">Est. {team.firstAppearanceYear}</div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
