import { PrismaClient } from '@prisma/client'
import path from 'path'

/**
 * Lazily create the Prisma client so module import during Next.js build
 * static analysis doesn't trigger adapter-provider compatibility checks.
 * The client is instantiated on the first actual DB call, not at import time.
 */
function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'

  if (url.startsWith('file:')) {
    // Local SQLite via libsql adapter
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql')
    const filePath = url.replace('file:', '')
    const absPath = filePath.startsWith('/') ? filePath : path.join(process.cwd(), filePath)
    const adapter = new PrismaLibSql({ url: 'file://' + absPath })
    return new PrismaClient({ adapter })
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
  return new PrismaClient({ adapter })
}

// Singleton pattern — reuse across hot-reloads in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function getOrCreateClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

/**
 * Proxy that defers PrismaClient construction until the first property access.
 * This means importing lib/prisma.ts never instantiates the client — only
 * calling prisma.user.findMany() (or any other method) does.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getOrCreateClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
