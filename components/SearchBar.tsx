'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SearchResult {
  characters: { id: string; name: string; realName: string | null; imageUrl: string | null; publisherSlug: string; slug: string }[]
  events: { id: string; name: string; publisherSlug: string }[]
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (query.length < 2) { setResults(null); setOpen(false); return }
    const t = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
      setOpen(true)
      setLoading(false)
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const hasResults = results && (results.characters.length > 0 || results.events.length > 0)
  const isEmpty = results && results.characters.length === 0 && results.events.length === 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">⌕</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results && setOpen(true)}
            placeholder="Search characters, events…"
            className="bg-gray-800 border border-gray-700 rounded-full pl-8 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 w-48 focus:w-64 transition-all"
          />
        </div>
      </form>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {loading && (
            <div className="px-4 py-3 text-gray-500 text-sm">Searching…</div>
          )}
          {!loading && isEmpty && (
            <div className="px-4 py-3 text-gray-500 text-sm">No results for "{query}"</div>
          )}
          {!loading && hasResults && (
            <>
              {results.characters.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 text-xs text-gray-500 uppercase tracking-wider font-semibold">Characters</div>
                  {results.characters.map((c) => (
                    <Link
                      key={c.id}
                      href={`/${c.publisherSlug}/${c.slug}`}
                      onClick={() => { setOpen(false); setQuery('') }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {c.imageUrl
                          ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                          : <span className={`text-sm font-black ${c.publisherSlug === 'marvel' ? 'text-red-600' : 'text-blue-600'}`}>{c.name.charAt(0)}</span>
                        }
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{c.name}</div>
                        {c.realName && <div className="text-xs text-gray-400">{c.realName}</div>}
                      </div>
                      <div className={`ml-auto text-xs font-bold uppercase ${c.publisherSlug === 'marvel' ? 'text-red-500' : 'text-blue-400'}`}>
                        {c.publisherSlug}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {results.events.length > 0 && (
                <div className="border-t border-gray-800">
                  <div className="px-4 pt-3 pb-1 text-xs text-gray-500 uppercase tracking-wider font-semibold">Events</div>
                  {results.events.map((e) => (
                    <Link
                      key={e.id}
                      href={`/events/${e.id}`}
                      onClick={() => { setOpen(false); setQuery('') }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-yellow-500 text-xs">★</div>
                      <div className="text-sm font-semibold text-white">{e.name}</div>
                      <div className={`ml-auto text-xs font-bold uppercase ${e.publisherSlug === 'marvel' ? 'text-red-500' : 'text-blue-400'}`}>
                        {e.publisherSlug}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-800 px-4 py-2">
                <button
                  onClick={() => { setOpen(false); router.push(`/search?q=${encodeURIComponent(query)}`) }}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  See all results for "{query}" →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
