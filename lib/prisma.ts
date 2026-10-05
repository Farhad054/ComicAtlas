import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'

  if (url.startsWith('file:')) {
    // Local SQLite via libsql adapter
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql')
    const filePath = url.replace('file:', '')
    const absPath = filePath.startsWith('/') ? filePath : path.join(process.cwd(), filePath)
    const adapter = new PrismaLibSql({ url: 'file://' + absPath })
    return new PrismaClient({ adapter } as any)
  }

  // Postgres via Neon serverless adapter
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool, neonConfig } = require('@neondatabase/serverless')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ws = require('ws')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaNeon } = require('@prisma/adapter-neon')
  neonConfig.webSocketConstructor = ws
  const pool = new Pool({ connectionString: url })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter } as any)
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
