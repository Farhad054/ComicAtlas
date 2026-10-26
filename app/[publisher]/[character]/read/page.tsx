import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getViewer } from '@/lib/spoilerContext'
import { gate } from '@/lib/spoilers'
import { toSlug } from '@/lib/slug'
import { ReadingPathList, TierSwitcher, TIER_CONFIG, parseTier, type Tier } from '@/components/ReadingPathList'

export default async function ReadingPathPage({
  params,
  searchParams,
}: {
  params: Promise<{ publisher: string; character: string }>
  searchParams: Promise<{ tier?: string }>
}) {
  const { publisher: publisherSlug, character: characterSlug } = await params
  const { tier: tierParam } = await searchParams

  const publisher = await prisma.publisher.findUnique({ where: { slug: publisherSlug } })
  if (!publisher) notFound()

  const characters = await prisma.character.findMany({ where: { publisherId: publisher.id } })
  const character = characters.find((c) => toSlug(c.name) === characterSlug)
  if (!character) notFound()

  const paths = await prisma.readingPath.findMany({
    where: { characterId: character.id },
    include: { nodes: { orderBy: { order: 'asc' }, include: { issue: true } } },
  })

  const { userId, spoilers } = await getViewer()
  const available = (Object.keys(TIER_CONFIG) as Tier[]).filter((t) => paths.some((p) => p.tier === t))
  const activeTier = parseTier(tierParam, available.includes('beginner') ? 'beginner' : available[0] ?? 'beginner')
  const activePath = paths.find((p) => p.tier === activeTier)

  const nodes = (activePath?.nodes ?? []).map((node) => ({
    id: node.id,
    issueId: node.issueId,
    required: node.required,
    estTimeMinutes: node.estTimeMinutes,
    whyItMatters: gate(spoilers, node, node.whyItMatters),
    issue: node.issue,
  }))

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-sm text-gray-400 mb-1">Reading Path</div>
        <h1 className="text-3xl font-black">{character.name}</h1>
      </div>

      <div className="mb-8">
        <TierSwitcher basePath={`/${publisherSlug}/${characterSlug}/read`} active={activeTier} available={available} />
      </div>

      <div className="text-sm text-gray-400 mb-6">{TIER_CONFIG[activeTier].desc}</div>

      <ReadingPathList nodes={nodes} readIssueIds={spoilers.readIssueIds} signedIn={userId !== null} />
    </div>
  )
}
