import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function PublisherPage({ params }: { params: Promise<{ publisher: string }> }) {
  const { publisher: publisherSlug } = await params
  const publisher = await prisma.publisher.findUnique({
    where: { slug: publisherSlug },
    include: {
      characters: true,
    },
  })

  if (!publisher) notFound()

  const isMarvel = publisher.slug === 'marvel'

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className={`mb-12 p-8 rounded-2xl bg-gradient-to-br ${isMarvel ? 'from-red-950 to-gray-950 border border-red-800' : 'from-blue-950 to-gray-950 border border-blue-800'}`}>
        <div className={`text-6xl font-black mb-2 ${isMarvel ? 'text-red-500' : 'text-blue-400'}`}>{publisher.name}</div>
        <p className="text-gray-400">Pick a character to start your reading journey.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {publisher.characters.map((char) => (
          <Link
            key={char.id}
            href={`/${publisherSlug}/${char.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className={`group rounded-xl overflow-hidden border transition-all hover:scale-105 hover:shadow-xl ${
              isMarvel ? 'bg-gray-900 border-gray-800 hover:border-red-500' : 'bg-gray-900 border-gray-800 hover:border-blue-500'
            }`}
          >
            <div className="aspect-[3/4] bg-gray-800 relative">
              {char.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isMarvel ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-blue-950 to-gray-900'}`}>
                  <span className={`text-7xl font-black select-none ${isMarvel ? 'text-red-800' : 'text-blue-800'}`}>
                    {char.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
            <div className="p-4">
              <div className={`font-black text-lg mb-1 ${isMarvel ? 'group-hover:text-red-400' : 'group-hover:text-blue-400'} transition-colors`}>
                {char.name}
              </div>
              <div className="text-gray-400 text-sm line-clamp-2">{char.bio.slice(0, 80)}...</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
