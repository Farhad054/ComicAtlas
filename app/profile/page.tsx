import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id

  const progress = await prisma.readingProgress.findMany({
    where: { userId, read: true },
    include: {
      issue: { include: { publisher: true } },
    },
    orderBy: { id: 'desc' },
  })

  const readCount = progress.length

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">Your Reading Profile</h1>
      <p className="text-gray-400 mb-8">{session.user?.email}</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-yellow-400">{readCount}</div>
          <div className="text-gray-400 text-sm">Issues Read</div>
        </div>
      </div>

      {progress.length > 0 && (
        <div>
          <h2 className="font-black text-xl mb-4">Read Issues</h2>
          <div className="space-y-2">
            {progress.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
                <div className={`w-2 h-2 rounded-full ${p.issue.publisher.slug === 'marvel' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="text-sm">
                  <span className="font-semibold">{p.issue.seriesName}</span>
                  <span className="text-gray-500"> #{p.issue.issueNumber}</span>
                  <span className="text-gray-600"> · {p.issue.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {progress.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No issues read yet.</p>
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            Start exploring comics →
          </Link>
        </div>
      )}
    </div>
  )
}
