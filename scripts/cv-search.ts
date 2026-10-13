/**
 * Comic Vine character/team search helper — run with:
 *   npm run cv:search -- "Batman" character
 *   npm run cv:search -- "Justice League" team
 *
 * Prints the top 5 results with their CV IDs so you can pick the right one
 * for cv-manifest.json.
 */

import https from 'https'
import path from 'path'
import fs from 'fs'

const API_KEY = process.env.COMIC_VINE_API_KEY
const CV_BASE = 'https://comicvine.gamespot.com/api'
const CACHE_DIR = path.join(process.cwd(), '.cache', 'cv', 'search')

const args = process.argv.slice(2)
const query = args[0]
const resourceType = (args[1] ?? 'character') as 'character' | 'team'

if (!query) {
  console.error('Usage: npm run cv:search -- "<name>" [character|team]')
  process.exit(1)
}

if (!API_KEY) {
  console.error('Error: COMIC_VINE_API_KEY is not set.')
  process.exit(1)
}

function fetchJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'ComicAtlas/1.0 (https://github.com/Farhad054/ComicAtlas)' },
    }, (res) => {
      let body = ''
      res.on('data', (c) => (body += c))
      res.on('end', () => {
        try { resolve(JSON.parse(body)) }
        catch { reject(new Error(`JSON parse error: ${body.slice(0, 200)}`)) }
      })
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

async function main() {
  const cacheFile = path.join(CACHE_DIR, `${resourceType}-${query.replace(/[^a-z0-9]/gi, '_')}.json`)
  fs.mkdirSync(CACHE_DIR, { recursive: true })

  let data: unknown
  if (fs.existsSync(cacheFile)) {
    data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
    console.log('(using cached result)\n')
  } else {
    const url = `${CV_BASE}/search/?api_key=${API_KEY}&format=json&resources=${resourceType}&query=${encodeURIComponent(query)}&field_list=id,name,publisher,image,deck&limit=5`
    data = await fetchJson(url)
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2))
  }

  interface SearchResult {
    id: number
    name: string
    deck?: string
    publisher?: { name: string }
    image?: { medium_url?: string; super_url?: string }
  }
  interface SearchResponse {
    error: string
    results: SearchResult[]
  }
  const resp = data as SearchResponse
  if (resp.error !== 'OK') {
    console.error('CV error:', resp.error)
    process.exit(1)
  }

  console.log(`Top ${resp.results.length} results for "${query}" (${resourceType}):\n`)
  for (const r of resp.results) {
    const pub = r.publisher?.name ?? '—'
    const img = r.image?.medium_url ?? '(no image)'
    console.log(`  ID: ${r.id}`)
    console.log(`  Name: ${r.name}`)
    console.log(`  Publisher: ${pub}`)
    console.log(`  Blurb: ${r.deck ?? '—'}`)
    console.log(`  Image: ${img}`)
    console.log()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
