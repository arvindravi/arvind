import { getSession } from '@auth0/nextjs-auth0'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { UserRole } from '~/graphql/types.generated'
import { prisma } from '~/lib/prisma'

async function isAdmin(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res)
  const sub = session?.user?.sub
  if (!sub) return false
  const viewer = await prisma.user.findUnique({ where: { twitterId: sub } })
  return viewer?.role === UserRole.Admin
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as HandleUploadBody

  try {
    const response = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin(req, res))) {
          throw new Error('Unauthorized')
        }
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB
        }
      },
      onUploadCompleted: async () => {},
    })
    return res.status(200).json(response)
  } catch (err) {
    if ((err as Error).message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    console.error('[images/upload] error', err)
    return res.status(500).json({ error: 'Upload failed' })
  }
}
