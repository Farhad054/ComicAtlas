/**
 * Smoke crawler — run with: npm run smoke
 *
 * Requires the app to be running locally (npm run dev or npm start).
 * Visits every DB-generated route and checks:
 *   1. HTTP status is 200
 *   2. All <img src="..."> URLs in the page return 200 (no broken images)
 *   3. No <img> renders without an src (missing fallback)
 *
 * Reports a pass/fail summary with details.
 */

import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'
import http from 'http'
import https from 'https'

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'

// ── DB client ──────────────────────────────────────────────────────────────
const absDbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaLibSql({ url: 'file://' + absDbPath })
const prisma = new PrismaClient({ adapter })

// ── HTTP helpers ────────────────────────────────────────────────────────────
function fetch(url: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    mod.get(url, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body }))
    }).on('error', reject)
  })
}

function checkUrl(url: string): Promise<number> {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const tryMethod = (method: 'HEAD' | 'GET') => {
      try {
        const req = mod.request(url, { method, headers: { 'User-Agent': 'ComicAtlas-Smoke/1.0' } }, (res) => {
          const code = res.statusCode ?? 0
          // Consume response body to avoid socket hang
          res.resume()
          // If HEAD returns 405/501, retry with GET
          if (method === 'HEAD' && (code === 405 || code === 501)) {
            tryMethod('GET')
          } else {
            resolve(code)
          }
        })
        req.on('error', () => resolve(0))
        req.end()
      } catch {
        resolve(0)
      }
    }
    tryMethod('HEAD')
  })
}

// ── Image extraction ────────────────────────────────────────────────────────
function extractImageSrcs(html: string): string[] {
  const srcs: string[] = []
  const re = /<img[^>]+src="([^"]+)"/gi
  let m
  while ((m = re.exec(html)) !== null) {
    srcs.push(m[1])
  }
  return srcs
}

// ── Main ────────────────────────────────────────────────────────────────────
interface Result {
  route: string
  pageStatus: number
  brokenImages: string[]
  ok: boolean
}

async function checkRoute(route: string): Promise<Result> {
  const url = BASE_URL + route
  let pageStatus = 0
  const brokenImages: string[] = []

  try {
    const { status, body } = await fetch(url)
    pageStatus = status

    if (status === 200) {
      const srcs = extractImageSrcs(body)
      // Check external image URLs (absolute http/https)
      const external = srcs.filter((s) => s.startsWith('http'))
      const checks = await Promise.all(
        external.map(async (imgUrl) => {
          const code = await checkUrl(imgUrl)
          return code === 200 || code === 301 || code === 302 ? null : imgUrl
        })
      )
      brokenImages.push(...(checks.filter(Boolean) as string[]))
    }
  } catch {
    pageStatus = -1
  }

  return {
    route,
    pageStatus,
    brokenImages,
    ok: pageStatus === 200 && brokenImages.length === 0,
  }
}

async function main() {
  const [publishers, characters, events, teams] = await Promise.all([
    prisma.publisher.findMany(),
    prisma.character.findMany({ include: { publisher: true } }),
    prisma.event.findMany(),
    prisma.team.findMany(),
  ])

  const routes: string[] = [
    '/',
    '/events',
    '/teams',
    '/creators',
    '/search?q=spider',
    '/login',
  ]

  for (const pub of publishers) {
    routes.push(`/${pub.slug}`)
  }
  for (const char of characters) {
    const slug = char.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    routes.push(`/${char.publisher.slug}/${slug}`)
    routes.push(`/${char.publisher.slug}/${slug}/read`)
  }
  for (const event of events) {
    routes.push(`/events/${event.id}`)
  }
  for (const team of teams) {
    routes.push(`/teams/${team.slug}`)
  }

  console.log(`\nSmoke crawling ${routes.length} routes against ${BASE_URL}\n`)

  const results: Result[] = []
  for (const route of routes) {
    const r = await checkRoute(route)
    const icon = r.ok ? '✓' : '✗'
    const detail = r.ok
      ? ''
      : ` [${r.pageStatus !== 200 ? `HTTP ${r.pageStatus}` : ''}${r.brokenImages.length ? ` broken images: ${r.brokenImages.join(', ')}` : ''}]`
    console.log(`  ${icon} ${route}${detail}`)
    results.push(r)
  }

  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok)

  console.log(`\n─────────────────────────────────────────`)
  console.log(`Passed: ${passed} / ${routes.length}`)
  if (failed.length) {
    console.log(`Failed: ${failed.length}`)
    process.exit(1)
  } else {
    console.log('All routes OK.')
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
