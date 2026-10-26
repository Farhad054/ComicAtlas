'use server'

import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SPOILER_COOKIE } from '@/lib/spoilers'

export async function setSpoilerProtection(protect: boolean): Promise<void> {
  const store = await cookies()
  store.set(SPOILER_COOKIE, protect ? '1' : '0', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })

  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    await prisma.user.update({ where: { id: session.user.id }, data: { spoilerModeOn: protect } })
  }
}

export async function setIssueRead(issueId: string, read: boolean): Promise<{ ok: boolean }> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { ok: false }
  const userId = session.user.id
  await prisma.readingProgress.upsert({
    where: { userId_issueId: { userId, issueId } },
    update: { read },
    create: { userId, issueId, read },
  })
  return { ok: true }
}
