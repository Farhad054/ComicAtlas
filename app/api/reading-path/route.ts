import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const publisherSlug = searchParams.get('publisher')
  const characterSlug = searchParams.get('character')

  if (!publisherSlug || !characterSlug) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const publisher = await prisma.publisher.findUnique({ where: { slug: publisherSlug } })
  if (!publisher) return NextResponse.json({ paths: [] })

  const characters = await prisma.character.findMany({ where: { publisherId: publisher.id } })
  const character = characters.find(
    (c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === characterSlug
  )
  if (!character) return NextResponse.json({ paths: [] })

  const paths = await prisma.readingPath.findMany({
    where: { characterId: character.id },
    include: {
      nodes: {
        orderBy: { order: 'asc' },
        include: { issue: true },
      },
    },
  })

  return NextResponse.json({ paths })
}
