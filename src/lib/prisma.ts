import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  if (process.env.NODE_ENV === 'production') {
    // Use the Neon serverless WebSocket adapter in production (Vercel).
    // This avoids unreliable TCP connections from serverless functions.
    neonConfig.webSocketConstructor = ws
    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
    return new PrismaClient({ adapter } as any)
  }

  // In development use a regular Prisma client (works with any Postgres).
  return new PrismaClient({})
}

export const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
