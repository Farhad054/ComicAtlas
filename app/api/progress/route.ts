import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { issueId, read } = await req.json()
  const userId = (session.user as any).id

  const progress = await prisma.readingProgress.upsert({
    where: { userId_issueId: { userId, issueId } },
    update: { read },
    create: { userId, issueId, read },
  })

  return NextResponse.json(progress)
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json([])

  const userId = (session.user as any).id
  const progress = await prisma.readingProgress.findMany({
    where: { userId, read: true },
    select: { issueId: true },
  })

  return NextResponse.json(progress.map((p) => p.issueId))
}
