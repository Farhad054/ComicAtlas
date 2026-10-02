import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SpoilerToggle } from './SpoilerToggle'
import { SearchBar } from './SearchBar'

export async function Header() {
  const session = await getServerSession(authOptions)
  let spoilerMode = false

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { spoilerModeOn: true },
    })
    spoilerMode = user?.spoilerModeOn ?? false
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight text-white hover:text-yellow-400 transition-colors">
          Comic<span className="text-yellow-400">Atlas</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/events" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">Events</Link>
          <Link href="/creators" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Creators</Link>
          <SearchBar />
          <SpoilerToggle initialValue={spoilerMode} />
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">
                Profile
              </Link>
              <Link href="/api/auth/signout" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign out
              </Link>
            </div>
          ) : (
            <Link href="/login" className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-yellow-300 transition-colors">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
