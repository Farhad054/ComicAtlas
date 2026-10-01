import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { SpoilerText } from '@/components/SpoilerText'
import { ConnectionsGraph } from '@/components/ConnectionsGraph'

async function getCharacter(publisherSlug: string, characterSlug: string) {
  const publisher = await prisma.publisher.findUnique({ where: { slug: publisherSlug } })
  if (!publisher) return null

  const characters = await prisma.character.findMany({
    where: { publisherId: publisher.id },
    include: {
      timelineEvents: { orderBy: { order: 'asc' } },
      relationshipsA: { include: { characterB: true } },
      relationshipsB: { include: { characterA: true } },
    },
  })

  const char = characters.find(
    (c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === characterSlug
  )

  return { character: char ?? null, publisher }
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ publisher: string; character: string }>
}) {
  const { publisher: publisherSlug, character: characterSlug } = await params
  const result = await getCharacter(publisherSlug, characterSlug)
  if (!result) notFound()
  const { character, publisher } = result
  if (!character) notFound()

  const session = await getServerSession(authOptions)
  let spoilerMode = false
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { spoilerModeOn: true },
    })
    spoilerMode = user?.spoilerModeOn ?? false
  }

  const isMarvel = publisher.slug === 'marvel'
  const aliases: string[] = JSON.parse(character.aliases)
  const powers: string[] = JSON.parse(character.powers)
  const creators: string[] = JSON.parse(character.creators)

  const allies = [
    ...character.relationshipsA.filter((r) => r.type === 'ally').map((r) => r.characterB),
    ...character.relationshipsB.filter((r) => r.type === 'ally').map((r) => r.characterA),
  ]
  const villains = [
    ...character.relationshipsA.filter((r) => r.type === 'villain').map((r) => r.characterB),
    ...character.relationshipsB.filter((r) => r.type === 'villain').map((r) => r.characterA),
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className={`rounded-2xl overflow-hidden mb-8 ${isMarvel ? 'bg-gradient-to-br from-red-950 via-gray-950 to-gray-950 border border-red-900' : 'bg-gradient-to-br from-blue-950 via-gray-950 to-gray-950 border border-blue-900'}`}>
        <div className="flex flex-col md:flex-row gap-6 p-8">
          {character.imageUrl && (
            <div className="w-40 h-52 rounded-xl overflow-hidden flex-shrink-0 border border-gray-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className={`text-sm font-semibold mb-2 ${isMarvel ? 'text-red-400' : 'text-blue-400'}`}>
              {publisher.name}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-1">{character.name}</h1>
            {character.realName && (
              <div className="text-gray-400 text-lg mb-2">{character.realName}</div>
            )}
            {aliases.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {aliases.map((a) => (
                  <span key={a} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-300 leading-relaxed">{character.bio}</p>
          </div>
        </div>
      </div>

      {/* Key Facts Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {character.firstAppearanceIssue && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">First Appearance</div>
            <div className="text-sm font-semibold">{character.firstAppearanceIssue}</div>
            {character.firstAppearanceYear && (
              <div className="text-xs text-gray-400">{character.firstAppearanceYear}</div>
            )}
          </div>
        )}
        {creators.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created By</div>
            <div className="text-sm font-semibold">{creators.join(', ')}</div>
          </div>
        )}
        {powers.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 col-span-2">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Powers</div>
            <div className="flex flex-wrap gap-1">
              {powers.map((p) => (
                <span key={p} className={`text-xs px-2 py-0.5 rounded-full ${isMarvel ? 'bg-red-950 text-red-300' : 'bg-blue-950 text-blue-300'}`}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
        {character.currentStatusText && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 col-span-2 md:col-span-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Status</div>
            <SpoilerText text={character.currentStatusText} spoilerMode={spoilerMode} className="text-sm" />
          </div>
        )}
      </div>

      {/* Timeline */}
      {character.timelineEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-black mb-4">Key Life Events</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
            <div className="space-y-4">
              {character.timelineEvents.map((event) => (
                <div key={event.id} className="relative flex gap-4 pl-10">
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 top-1.5 ${isMarvel ? 'border-red-500 bg-gray-950' : 'border-blue-500 bg-gray-950'}`} />
                  <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-xs font-bold ${isMarvel ? 'text-red-400' : 'text-blue-400'}`}>{event.year}</span>
                        <h3 className="font-semibold text-sm">{event.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connections */}
      {(allies.length > 0 || villains.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-black mb-4">Connections</h2>
          <ConnectionsGraph
            character={character.name}
            allies={allies.map((a) => ({ id: a.id, name: a.name, publisherSlug: publisherSlug }))}
            villains={villains.map((v) => ({ id: v.id, name: v.name, publisherSlug: publisherSlug }))}
          />
        </div>
      )}

      {/* Start Reading CTA */}
      <div className="text-center">
        <Link
          href={`/${publisherSlug}/${characterSlug}/read`}
          className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-black transition-all hover:scale-105 ${
            isMarvel
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          Start Reading
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
