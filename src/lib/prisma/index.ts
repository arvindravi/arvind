import { PrismaClient } from '@prisma/client'

import { mockPrisma } from './mock'

declare global {
  var prisma: PrismaClient | undefined
}

// MOCK_DB=true → in-memory mock client (./mock.ts). Lets you develop with
// no Postgres instance and no service keys; see .env.example / README.
export const prisma: PrismaClient =
  process.env.MOCK_DB === 'true'
    ? mockPrisma
    : global.prisma || new PrismaClient({})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
