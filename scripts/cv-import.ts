/**
 * Comic Vine image import — run with: npm run import:images
 *
 * Fetches character and team images from the Comic Vine API and writes them
 * into the database. Responses are cached in .cache/cv/ so re-runs don't
 * burn rate-limit quota (200 req/hr on the free tier).
 *
 * Flags:
 *   --force          Re-fetch even if .cache entry exists
 *   --dry-run        Print what would change without writing to DB
 *   --only-missing   Skip records that already have an imageUrl
 *   --char <name>    Import a single character by exact name
 *   --team <name>    Import a single team by exact name
 *
 * Usage:
 *   npm run import:images
 *   npm run import:images -- --only-missing
 *   npm run import:images -- --char "Daredevil" --dry-run
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

// ── DB client ──────────────────────────────────────────────────────────────
const absDbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaLibSql({ url: 'file://' + absDbPath })
const prisma = new PrismaClient({ adapter })

// ── Config ─────────────────────────────────────────────────────────────────
const API_KEY = process.env.COMIC_VINE_API_KEY
const CACHE_DIR = path.join(process.cwd(), '.cache', 'cv')
const RATE_LIMIT_DELAY_MS = 1100 // ~55 req/min, safely under 200/hr
const CV_BASE = 'https://comicvine.gamespot.com/api'

// ── CLI flags ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const DRY_RUN = args.includes('--dry-run')
const ONLY_MISSING = args.includes('--only-missing')
const SINGLE_CHAR = args.includes('--char') ? args[args.indexOf('--char') + 1] : null
const SINGLE_TEAM = args.includes('--team') ? args[args.indexOf('--team') + 1] : null

// ── Manifest ───────────────────────────────────────────────────────────────
interface ManifestEntry {
  name: string
  publisher: string
  cvId: number
}
interface Manifest {
  characters: ManifestEntry[]
  teams: ManifestEntry[]
}
const manifest: Manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'cv-manifest.json'), 'utf8')
)

// ── HTTP helpers ───────────────────────────────────────────────────────────
function fetchJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'ComicAtlas/1.0 (https://github.com/Farhad054/ComicAtlas)',
      },
    }, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch {
          reject(new Error(`JSON parse error for ${url}: ${body.slice(0, 200)}`))
        }
      })
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)) })
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

// ── Cache ──────────────────────────────────────────────────────────────────
function cacheKey(resource: 'character' | 'team', cvId: number): string {
  return path.join(CACHE_DIR, `${resource}-${cvId}.json`)
}

function readCache(key: string): unknown | null {
  if (FORCE) return null
  try {
    return JSON.parse(fs.readFileSync(key, 'utf8'))
  } catch {
    return null
  }
}

function writeCache(key: string, data: unknown): void {
  fs.mkdirSync(path.dirname(key), { recursive: true })
  fs.writeFileSync(key, JSON.stringify(data, null, 2))
}

// ── CV API fetchers ────────────────────────────────────────────────────────
interface CvImage {
  icon_url?: string
  medium_url?: string
  screen_url?: string
  screen_large_url?: string
  small_url?: string
  super_url?: string
  thumb_url?: string
  tiny_url?: string
  original_url?: string
}

interface CvResult {
  id: number
  name: string
  image?: CvImage
  error?: string
}

interface CvResponse {
  error: string
  results: CvResult | CvResult[]
}

function pickImageUrl(image?: CvImage): string | null {
  if (!image) return null
  // Prefer super_url (large), fall back through decreasing quality
  return image.super_url ?? image.screen_large_url ?? image.medium_url ?? image.small_url ?? null
}

async function fetchCharacterFromCV(cvId: number): Promise<{ imageUrl: string | null; name: string } | null> {
  const key = cacheKey('character', cvId)
  let data = readCache(key) as CvResponse | null

  if (!data) {
    const url = `${CV_BASE}/character/4005-${cvId}/?api_key=${API_KEY}&format=json&field_list=id,name,image`
    console.log(`  → CV fetch character/${cvId}`)
    data = await fetchJson(url) as CvResponse
    writeCache(key, data)
    await sleep(RATE_LIMIT_DELAY_MS)
  } else {
    console.log(`  → cache hit character/${cvId}`)
  }

  if (data.error !== 'OK' || !data.results || Array.isArray(data.results)) {
    console.warn(`  ✗ CV error for character/${cvId}:`, data.error)
    return null
  }

  const result = data.results as CvResult
  return {
    name: result.name,
    imageUrl: pickImageUrl(result.image),
  }
}

async function fetchTeamFromCV(cvId: number): Promise<{ imageUrl: string | null; name: string } | null> {
  const key = cacheKey('team', cvId)
  let data = readCache(key) as CvResponse | null

  if (!data) {
    const url = `${CV_BASE}/team/4060-${cvId}/?api_key=${API_KEY}&format=json&field_list=id,name,image`
    console.log(`  → CV fetch team/${cvId}`)
    data = await fetchJson(url) as CvResponse
    writeCache(key, data)
    await sleep(RATE_LIMIT_DELAY_MS)
  } else {
    console.log(`  → cache hit team/${cvId}`)
  }

  if (data.error !== 'OK' || !data.results || Array.isArray(data.results)) {
    console.warn(`  ✗ CV error for team/${cvId}:`, data.error)
    return null
  }

  const result = data.results as CvResult
  return {
    name: result.name,
    imageUrl: pickImageUrl(result.image),
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function importCharacters(entries: ManifestEntry[]) {
  const dbChars = await prisma.character.findMany({
    select: { id: true, name: true, imageUrl: true, imageOverrideUrl: true },
  })
  const byName = new Map(dbChars.map((c) => [c.name.toLowerCase(), c]))

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const entry of entries) {
    const dbChar = byName.get(entry.name.toLowerCase())
    if (!dbChar) {
      console.log(`  ⚠ "${entry.name}" not found in DB — add to seed.ts first`)
      skipped++
      continue
    }

    if (dbChar.imageOverrideUrl) {
      console.log(`  – "${entry.name}" has imageOverrideUrl, skipping`)
      skipped++
      continue
    }

    if (ONLY_MISSING && dbChar.imageUrl) {
      console.log(`  – "${entry.name}" already has imageUrl, skipping`)
      skipped++
      continue
    }

    console.log(`\n  [${entry.publisher}] ${entry.name} (cvId=${entry.cvId})`)
    const result = await fetchCharacterFromCV(entry.cvId)

    if (!result || !result.imageUrl) {
      console.warn(`  ✗ No image returned`)
      failed++
      continue
    }

    console.log(`  ✓ ${result.imageUrl}`)

    if (!DRY_RUN) {
      await prisma.character.update({
        where: { id: dbChar.id },
        data: { imageUrl: result.imageUrl },
      })
    }
    updated++
  }

  return { updated, skipped, failed }
}

async function importTeams(entries: ManifestEntry[]) {
  const dbTeams = await prisma.team.findMany({
    select: { id: true, name: true, imageUrl: true, imageOverrideUrl: true },
  })
  const byName = new Map(dbTeams.map((t) => [t.name.toLowerCase(), t]))

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const entry of entries) {
    const dbTeam = byName.get(entry.name.toLowerCase())
    if (!dbTeam) {
      console.log(`  ⚠ "${entry.name}" not found in DB — add to seed.ts first`)
      skipped++
      continue
    }

    if (dbTeam.imageOverrideUrl) {
      console.log(`  – "${entry.name}" has imageOverrideUrl, skipping`)
      skipped++
      continue
    }

    if (ONLY_MISSING && dbTeam.imageUrl) {
      console.log(`  – "${entry.name}" already has imageUrl, skipping`)
      skipped++
      continue
    }

    console.log(`\n  [${entry.publisher}] ${entry.name} (cvId=${entry.cvId})`)
    const result = await fetchTeamFromCV(entry.cvId)

    if (!result || !result.imageUrl) {
      console.warn(`  ✗ No image returned`)
      failed++
      continue
    }

    console.log(`  ✓ ${result.imageUrl}`)

    if (!DRY_RUN) {
      await prisma.team.update({
        where: { id: dbTeam.id },
        data: { imageUrl: result.imageUrl },
      })
    }
    updated++
  }

  return { updated, skipped, failed }
}

async function main() {
  if (!API_KEY) {
    console.error('Error: COMIC_VINE_API_KEY is not set. Add it to .env.local and run with dotenv.')
    process.exit(1)
  }

  if (DRY_RUN) console.log('DRY RUN — no DB writes\n')

  let charEntries = manifest.characters
  let teamEntries = manifest.teams

  if (SINGLE_CHAR) {
    charEntries = charEntries.filter((e) => e.name.toLowerCase() === SINGLE_CHAR.toLowerCase())
    teamEntries = []
    if (charEntries.length === 0) {
      console.error(`Character "${SINGLE_CHAR}" not found in manifest.`)
      process.exit(1)
    }
  }

  if (SINGLE_TEAM) {
    teamEntries = teamEntries.filter((e) => e.name.toLowerCase() === SINGLE_TEAM.toLowerCase())
    charEntries = []
    if (teamEntries.length === 0) {
      console.error(`Team "${SINGLE_TEAM}" not found in manifest.`)
      process.exit(1)
    }
  }

  console.log(`\nComic Vine import — ${charEntries.length} characters, ${teamEntries.length} teams\n`)

  let totalUpdated = 0
  let totalSkipped = 0
  let totalFailed = 0

  if (charEntries.length > 0) {
    console.log('Characters:')
    const stats = await importCharacters(charEntries)
    totalUpdated += stats.updated
    totalSkipped += stats.skipped
    totalFailed += stats.failed
  }

  if (teamEntries.length > 0) {
    console.log('\nTeams:')
    const stats = await importTeams(teamEntries)
    totalUpdated += stats.updated
    totalSkipped += stats.skipped
    totalFailed += stats.failed
  }

  console.log(`\n─────────────────────────────────────────`)
  console.log(`Updated: ${totalUpdated}  Skipped: ${totalSkipped}  Failed: ${totalFailed}`)
  if (DRY_RUN) console.log('(dry run — no writes made)')

  await prisma.$disconnect()

  if (totalFailed > 0) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
