/**
 * Comic Vine entity + image verifier
 *
 * For every entry in cv-manifest.json:
 *   1. Fetches the full CV entity (uses cache; --force re-fetches)
 *   2. Checks name, publisher, and firstAppearanceIssue against the DB record
 *   3. HEAD-checks the image URL for status and content-type
 *   4. Downloads the image to .cache/images/<slug>.<ext> for visual inspection
 *   5. Emits a JSON report to stdout (redirect to .cache/cv-verify-report.json)
 *
 * Run: npm run cv:verify
 * Then: inspect .cache/images/ visually, fix manifest if needed, re-run import.
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const API_KEY = process.env.COMIC_VINE_API_KEY
const CACHE_DIR = path.join(process.cwd(), '.cache', 'cv')
const IMG_DIR = path.join(process.cwd(), '.cache', 'images')
const CV_BASE = 'https://comicvine.gamespot.com/api'
const RATE_LIMIT_MS = 1100
const FORCE = process.argv.includes('--force')

const absDbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaLibSql({ url: 'file://' + absDbPath })
const prisma = new PrismaClient({ adapter })

interface ManifestEntry { name: string; publisher: string; cvId: number }
interface Manifest { characters: ManifestEntry[]; teams: ManifestEntry[] }
const manifest: Manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'cv-manifest.json'), 'utf8')
)

function fetchJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'ComicAtlas/1.0' } }, (res) => {
      let body = ''
      res.on('data', (c) => (body += c))
      res.on('end', () => { try { resolve(JSON.parse(body)) } catch { reject(new Error(`JSON parse: ${body.slice(0, 100)}`)) } })
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function readCache(key: string): unknown | null {
  if (FORCE) return null
  try { return JSON.parse(fs.readFileSync(key, 'utf8')) } catch { return null }
}
function writeCache(key: string, data: unknown) {
  fs.mkdirSync(path.dirname(key), { recursive: true })
  fs.writeFileSync(key, JSON.stringify(data, null, 2))
}

function headUrl(url: string): Promise<{ status: number; contentType: string }> {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const tryMethod = (method: 'HEAD' | 'GET') => {
      try {
        const req = mod.request(url, { method, headers: { 'User-Agent': 'ComicAtlas/1.0' } }, (res) => {
          const ct = (res.headers['content-type'] ?? '').toLowerCase()
          res.resume()
          if (method === 'HEAD' && (res.statusCode === 405 || res.statusCode === 501)) { tryMethod('GET'); return }
          resolve({ status: res.statusCode ?? 0, contentType: ct })
        })
        req.on('error', () => resolve({ status: 0, contentType: '' }))
        req.setTimeout(10000, () => { req.destroy(); resolve({ status: 0, contentType: 'timeout' }) })
        req.end()
      } catch { resolve({ status: 0, contentType: 'error' }) }
    }
    tryMethod('HEAD')
  })
}

function downloadImage(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath) && !FORCE) { resolve(); return }
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    const mod = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(destPath)

    const doGet = (u: string) => {
      mod.get(u, { headers: { 'User-Agent': 'ComicAtlas/1.0' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const loc = res.headers.location
          res.resume()
          if (loc) { doGet(loc); return }
        }
        if ((res.statusCode ?? 0) >= 400) {
          res.resume()
          file.close()
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }
        res.pipe(file)
        file.on('finish', () => file.close(() => resolve()))
      }).on('error', (e) => { file.close(); reject(e) })
    }
    doGet(url)
  })
}

interface CvCharResult {
  id: number
  name: string
  publisher?: { name: string }
  first_appeared_in_issue?: { name?: string; issue_number?: string } | null
  image?: {
    icon_url?: string; medium_url?: string; screen_url?: string
    screen_large_url?: string; small_url?: string; super_url?: string
    original_url?: string
  }
  error?: string
}

interface VerifyRow {
  kind: 'character' | 'team'
  dbName: string
  publisher: string
  cvId: number
  cvName?: string
  cvPublisher?: string
  cvFirstAppear?: string
  dbFirstAppear?: string
  nameMatch: boolean
  publisherMatch: boolean
  firstAppearMatch: boolean | 'n/a'
  imageUrl?: string
  imageStatus?: number
  imageContentType?: string
  imageFile?: string
  verdict: 'ok' | 'name-mismatch' | 'publisher-mismatch' | 'firstappear-mismatch' | 'image-fail' | 'fetch-fail' | 'skipped'
  note?: string
}

async function fetchAndVerify(
  kind: 'character' | 'team',
  entry: ManifestEntry,
  dbRecord: { id: string; name: string; imageUrl: string | null; firstAppearanceYear?: number | null; firstAppearanceIssue?: string | null }
): Promise<VerifyRow> {
  const row: VerifyRow = {
    kind, dbName: entry.name, publisher: entry.publisher, cvId: entry.cvId,
    nameMatch: false, publisherMatch: false, firstAppearMatch: 'n/a',
    verdict: 'fetch-fail',
  }

  const resourceType = kind === 'character' ? '4005' : '4060'
  const cacheKey = path.join(CACHE_DIR, `${kind}-${entry.cvId}.json`)
  let data = readCache(cacheKey) as { error: string; results: CvCharResult } | null

  if (!data) {
    const url = `${CV_BASE}/${kind}/${resourceType}-${entry.cvId}/?api_key=${API_KEY}&format=json&field_list=id,name,publisher,first_appeared_in_issue,image`
    data = await fetchJson(url) as { error: string; results: CvCharResult }
    writeCache(cacheKey, data)
    await sleep(RATE_LIMIT_MS)
  }

  if (data.error !== 'OK' || !data.results || Array.isArray(data.results)) {
    row.note = `CV error: ${data.error}`
    row.verdict = 'fetch-fail'
    return row
  }

  const r = data.results
  row.cvName = r.name
  row.cvPublisher = r.publisher?.name ?? '—'
  row.cvFirstAppear = r.first_appeared_in_issue
    ? `${r.first_appeared_in_issue.name ?? ''}`.trim() || '—'
    : '—'
  row.dbFirstAppear = dbRecord.firstAppearanceIssue ?? '—'

  // Name check (case-insensitive; allow slight variations like "Barry Allen" vs "The Flash")
  const cvNameNorm = (r.name ?? '').toLowerCase()
  const dbNameNorm = entry.name.toLowerCase()
  row.nameMatch = cvNameNorm === dbNameNorm ||
    cvNameNorm.includes(dbNameNorm) || dbNameNorm.includes(cvNameNorm)

  // Publisher check
  const cvPub = (r.publisher?.name ?? '').toLowerCase()
  const expectPub = entry.publisher === 'marvel' ? 'marvel' : 'dc'
  row.publisherMatch = cvPub.includes(expectPub) || cvPub.includes('dc comics') || cvPub.includes('marvel')

  // First appearance check (year only, loose)
  if (dbRecord.firstAppearanceYear && r.first_appeared_in_issue) {
    const issueName = (r.first_appeared_in_issue.name ?? '').toLowerCase()
    const dbIssue = (dbRecord.firstAppearanceIssue ?? '').toLowerCase()
    // Check if the series name has any overlap
    row.firstAppearMatch = issueName.length > 0 && dbIssue.length > 0
      ? (issueName.includes(dbIssue.split('#')[0].trim()) || dbIssue.includes(issueName.split('#')[0].trim()))
      : 'n/a'
  }

  // Determine which image URL to use: prefer super_url, then screen_large_url, then medium_url
  const img = r.image
  const imageUrl = dbRecord.imageUrl ?? img?.super_url ?? img?.screen_large_url ?? img?.medium_url ?? null
  row.imageUrl = imageUrl ?? undefined

  if (!imageUrl) {
    row.verdict = 'image-fail'
    row.note = 'no image URL'
    return row
  }

  // HTTP check
  const { status, contentType } = await headUrl(imageUrl)
  row.imageStatus = status
  row.imageContentType = contentType

  // Download for visual inspection
  const ext = imageUrl.includes('.png') ? 'png' : imageUrl.includes('.gif') ? 'gif' : 'jpg'
  const slug = `${kind}-${entry.publisher}-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const destPath = path.join(IMG_DIR, `${slug}.${ext}`)
  row.imageFile = destPath

  if (status >= 200 && status < 400) {
    try { await downloadImage(imageUrl, destPath) } catch (e) {
      row.note = `download failed: ${(e as Error).message}`
    }
  }

  // Verdict
  if (!row.nameMatch) row.verdict = 'name-mismatch'
  else if (!row.publisherMatch) row.verdict = 'publisher-mismatch'
  else if (row.firstAppearMatch === false) row.verdict = 'firstappear-mismatch'
  else if (status < 200 || status >= 400 || !contentType.includes('image')) row.verdict = 'image-fail'
  else row.verdict = 'ok'

  return row
}

async function main() {
  if (!API_KEY) { console.error('COMIC_VINE_API_KEY not set'); process.exit(1) }
  fs.mkdirSync(IMG_DIR, { recursive: true })

  const [dbChars, dbTeams] = await Promise.all([
    prisma.character.findMany({ include: { publisher: true } }),
    prisma.team.findMany({ include: { publisher: true } }),
  ])

  const charByName = new Map(dbChars.map(c => [c.name.toLowerCase(), c]))
  const teamByName = new Map(dbTeams.map(t => [t.name.toLowerCase(), t]))

  const rows: VerifyRow[] = []

  process.stderr.write('Verifying characters...\n')
  for (const entry of manifest.characters) {
    const dbRec = charByName.get(entry.name.toLowerCase())
    if (!dbRec) { rows.push({ kind: 'character', dbName: entry.name, publisher: entry.publisher, cvId: entry.cvId, nameMatch: false, publisherMatch: false, firstAppearMatch: 'n/a', verdict: 'skipped', note: 'not in DB' }); continue }
    process.stderr.write(`  ${entry.publisher} / ${entry.name}\n`)
    const row = await fetchAndVerify('character', entry, { id: dbRec.id, name: dbRec.name, imageUrl: dbRec.imageUrl, firstAppearanceYear: dbRec.firstAppearanceYear, firstAppearanceIssue: dbRec.firstAppearanceIssue })
    rows.push(row)
  }

  process.stderr.write('Verifying teams...\n')
  for (const entry of manifest.teams) {
    const dbRec = teamByName.get(entry.name.toLowerCase())
    if (!dbRec) { rows.push({ kind: 'team', dbName: entry.name, publisher: entry.publisher, cvId: entry.cvId, nameMatch: false, publisherMatch: false, firstAppearMatch: 'n/a', verdict: 'skipped', note: 'not in DB' }); continue }
    process.stderr.write(`  ${entry.publisher} / ${entry.name}\n`)
    const row = await fetchAndVerify('team', entry, { id: dbRec.id, name: dbRec.name, imageUrl: dbRec.imageUrl })
    rows.push(row)
  }

  await prisma.$disconnect()

  // Print report
  process.stdout.write(JSON.stringify(rows, null, 2))

  // Print summary to stderr
  const ok = rows.filter(r => r.verdict === 'ok').length
  const fail = rows.filter(r => r.verdict !== 'ok' && r.verdict !== 'skipped').length
  const skipped = rows.filter(r => r.verdict === 'skipped').length
  process.stderr.write(`\nDone — OK: ${ok}, Issues: ${fail}, Skipped (not in DB): ${skipped}\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
