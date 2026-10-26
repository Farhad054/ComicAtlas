import { prisma } from '../lib/prisma'
import {
  UNLOCK_ISSUES,
  TIMELINE_SPOILERS,
  STATUS_SPOILERS,
  MEMBERSHIP_SPOILERS,
  PATH_NODE_SPOILERS,
  EVENT_OUTCOMES,
  BIO_REWRITES,
  key,
} from './spoilers.data'

type Db = typeof prisma

export async function applySpoilers(db: Db): Promise<void> {
  const publishers = await db.publisher.findMany()
  const pubId = new Map(publishers.map((p) => [p.slug, p.id]))

  for (const i of UNLOCK_ISSUES) {
    const existing = await db.issue.findFirst({
      where: { seriesName: i.seriesName, issueNumber: i.issueNumber, year: i.year },
    })
    if (!existing) {
      await db.issue.create({
        data: { publisherId: pubId.get(i.publisher)!, seriesName: i.seriesName, issueNumber: i.issueNumber, year: i.year },
      })
    }
  }

  const issues = await db.issue.findMany()
  const issueByKey = new Map(issues.map((i) => [key(i.seriesName, i.issueNumber, i.year), i.id]))
  const resolve = (k: string | null): string | null => {
    if (k === null) return null
    const id = issueByKey.get(k)
    if (!id) throw new Error(`Unknown unlock issue: ${k}`)
    return id
  }

  // Reset, so removing an entry from the data file un-flags it.
  await db.timelineEvent.updateMany({ data: { isSpoiler: false, spoilerAfterIssueId: null } })
  await db.character.updateMany({ data: { statusIsSpoiler: false, statusSpoilerAfterIssueId: null } })
  await db.teamMembership.updateMany({ data: { isSpoiler: false, spoilerAfterIssueId: null } })
  await db.readingPathNode.updateMany({ data: { isSpoiler: false, spoilerAfterIssueId: null } })

  for (const [name, title, unlock] of TIMELINE_SPOILERS) {
    const r = await db.timelineEvent.updateMany({
      where: { title, character: { name } },
      data: { isSpoiler: true, spoilerAfterIssueId: resolve(unlock) },
    })
    if (r.count === 0) throw new Error(`No timeline event: ${name} / ${title}`)
  }

  for (const [name, unlock] of STATUS_SPOILERS) {
    const r = await db.character.updateMany({
      where: { name },
      data: { statusIsSpoiler: true, statusSpoilerAfterIssueId: resolve(unlock) },
    })
    if (r.count === 0) throw new Error(`No character: ${name}`)
  }

  for (const [teamSlug, displayName, unlock] of MEMBERSHIP_SPOILERS) {
    const r = await db.teamMembership.updateMany({
      where: { displayName, team: { slug: teamSlug } },
      data: { isSpoiler: true, spoilerAfterIssueId: resolve(unlock) },
    })
    if (r.count === 0) throw new Error(`No membership: ${teamSlug} / ${displayName}`)
  }

  for (const [issueKey, fragment] of PATH_NODE_SPOILERS) {
    const issueId = resolve(issueKey)!
    const r = await db.readingPathNode.updateMany({
      where: { issueId, whyItMatters: { contains: fragment } },
      data: { isSpoiler: true, spoilerAfterIssueId: issueId },
    })
    if (r.count === 0) throw new Error(`No path node: ${issueKey} / ${fragment}`)
  }

  for (const e of EVENT_OUTCOMES) {
    const r = await db.event.updateMany({
      where: { name: e.event },
      data: { summary: e.summary, outcomeText: e.outcome, outcomeSpoilerAfterIssueId: resolve(e.unlock) },
    })
    if (r.count === 0) throw new Error(`No event: ${e.event}`)
  }

  // Impact entries unlock once the event's last required issue is read.
  const events = await db.event.findMany({
    include: { readingPath: { include: { nodes: { orderBy: { order: 'asc' } } } } },
  })
  for (const ev of events) {
    const required = ev.readingPath?.nodes.filter((n) => n.required) ?? []
    const last = required[required.length - 1]
    await db.impactEntry.updateMany({
      where: { eventId: ev.id },
      data: { isSpoiler: true, spoilerAfterIssueId: last?.issueId ?? null },
    })
  }

  for (const [name, bio] of Object.entries(BIO_REWRITES)) {
    await db.character.updateMany({ where: { name }, data: { bio } })
  }
}

if (require.main === module) {
  applySpoilers(prisma)
    .then(() => console.log('Spoiler flags applied.'))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
