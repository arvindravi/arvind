import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL

  if (process.env.NODE_ENV === 'production' && databaseUrl) {
    // Use the Neon serverless WebSocket adapter in production (Vercel).
    // This avoids unreliable TCP connections from serverless functions.
    // Only uses the Neon adapter when DATABASE_URL is actually present so
    // that preview deployments without the env var don't crash at module load.
    neonConfig.webSocketConstructor = ws
    const adapter = new PrismaNeon({ connectionString: databaseUrl })
    return new PrismaClient({ adapter } as any)
  }

  // Development or production without DATABASE_URL — fall back to standard
  // PrismaClient (will fail gracefully at query time, not at import time).
  return new PrismaClient({})
}

export const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
