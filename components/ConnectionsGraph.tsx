'use client'

import Link from 'next/link'

interface Node {
  id: string
  name: string
  publisherSlug: string
}

interface ConnectionsGraphProps {
  character: string
  allies: Node[]
  villains: Node[]
}

export function ConnectionsGraph({ character, allies, villains }: ConnectionsGraphProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex flex-wrap gap-6 items-start justify-center">
        {/* Center node */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-xs text-center px-1">
            {character.split(' ')[0]}
          </div>
          <span className="text-xs text-gray-400">You</span>
        </div>

        {allies.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <div className="text-xs text-green-400 font-semibold uppercase tracking-wider">Allies</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {allies.map((ally) => (
                <Link
                  key={ally.id}
                  href={`/${ally.publisherSlug}/${ally.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-900 border-2 border-green-700 group-hover:border-green-400 flex items-center justify-center text-green-300 font-bold text-xs text-center px-1 transition-colors">
                    {ally.name.split(' ')[0].slice(0, 4)}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors max-w-[64px] text-center">{ally.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {villains.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <div className="text-xs text-red-400 font-semibold uppercase tracking-wider">Villains</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {villains.map((villain) => (
                <Link
                  key={villain.id}
                  href={`/${villain.publisherSlug}/${villain.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-red-900 border-2 border-red-700 group-hover:border-red-400 flex items-center justify-center text-red-300 font-bold text-xs text-center px-1 transition-colors">
                    {villain.name.split(' ')[0].slice(0, 4)}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors max-w-[64px] text-center">{villain.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
