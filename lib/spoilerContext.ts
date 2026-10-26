import { cache } from 'react'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SPOILER_COOKIE, type SpoilerContext } from '@/lib/spoilers'

export interface Viewer {
  userId: string | null
  spoilers: SpoilerContext
}

/**
 * Resolves who is looking and what they may see. Signed-in viewers use their
 * stored preference and read progress; signed-out viewers use the cookie
 * (default: protected) and an empty progress set.
 */
export const getViewer = cache(async (): Promise<Viewer> => {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id ?? null

  if (userId) {
    const [user, progress] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { spoilerModeOn: true } }),
      prisma.readingProgress.findMany({ where: { userId, read: true }, select: { issueId: true } }),
    ])
    return {
      userId,
      spoilers: {
        protect: user?.spoilerModeOn ?? true,
        readIssueIds: new Set(progress.map((p) => p.issueId)),
      },
    }
  }

  const raw = (await cookies()).get(SPOILER_COOKIE)?.value
  return { userId: null, spoilers: { protect: raw !== '0', readIssueIds: new Set() } }
})
