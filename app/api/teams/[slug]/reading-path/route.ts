import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      publisher: { select: { slug: true, name: true } },
      memberships: {
        include: {
          character: {
            include: { publisher: { select: { slug: true } } },
          },
        },
      },
      lineups: { orderBy: { id: 'asc' } },
      readingPaths: {
        include: {
          nodes: { orderBy: { order: 'asc' }, include: { issue: true } },
        },
      },
      eventTeams: {
        include: {
          event: { include: { publisher: { select: { slug: true } } } },
        },
      },
      relationshipsA: {
        include: { teamB: { select: { id: true, name: true, slug: true } } },
      },
      relationshipsB: {
        include: { teamA: { select: { id: true, name: true, slug: true } } },
      },
    },
  })
  if (!team) return NextResponse.json({ team: null, paths: [] })
  return NextResponse.json({ team, paths: team.readingPaths })
}
