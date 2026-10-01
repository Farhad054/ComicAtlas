import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
          Find Your Starting Point
        </h1>
        <p className="text-xl text-gray-400 max-w-xl mb-12">
          Pick a universe. Pick a character. We&apos;ll build your reading path — zero prior knowledge required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link href="/marvel" className="group relative overflow-hidden rounded-2xl bg-red-950 border-2 border-red-700 hover:border-red-400 transition-all p-8 text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent" />
            <div className="relative">
              <div className="text-5xl font-black text-red-500 mb-2">MARVEL</div>
              <div className="text-gray-300 text-sm">Spider-Man · X-Men · Avengers · 80+ years of stories</div>
            </div>
            <div className="absolute bottom-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-2xl">→</div>
          </Link>
          <Link href="/dc" className="group relative overflow-hidden rounded-2xl bg-blue-950 border-2 border-blue-700 hover:border-blue-400 transition-all p-8 text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
            <div className="relative">
              <div className="text-5xl font-black text-blue-400 mb-2">DC</div>
              <div className="text-gray-300 text-sm">Batman · Superman · Justice League · the original universe</div>
            </div>
            <div className="absolute bottom-4 right-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-2xl">→</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
