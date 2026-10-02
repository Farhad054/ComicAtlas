import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim()

  if (q.length < 2) return NextResponse.json({ characters: [], events: [] })

  const lower = q.toLowerCase()

  const [characters, events] = await Promise.all([
    prisma.character.findMany({
      include: { publisher: { select: { slug: true } } },
    }),
    prisma.event.findMany({
      include: { publisher: { select: { slug: true } } },
    }),
  ])

  const matchedChars = characters.filter((c) => {
    const aliases: string[] = JSON.parse(c.aliases)
    return (
      c.name.toLowerCase().includes(lower) ||
      (c.realName ?? '').toLowerCase().includes(lower) ||
      aliases.some((a) => a.toLowerCase().includes(lower))
    )
  }).map((c) => ({
    id: c.id,
    name: c.name,
    realName: c.realName,
    imageUrl: c.imageUrl,
    publisherSlug: c.publisher.slug,
    slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }))

  const matchedEvents = events.filter((e) =>
    e.name.toLowerCase().includes(lower)
  ).map((e) => ({
    id: e.id,
    name: e.name,
    publisherSlug: e.publisher.slug,
  }))

  return NextResponse.json({ characters: matchedChars, events: matchedEvents })
}
