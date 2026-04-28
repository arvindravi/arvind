import { getSession } from '@auth0/nextjs-auth0'
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
  if (!(await isAdmin(req, res))) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiKey = process.env.CLOUDFLARE_IMAGES_KEY
  if (!accountId || !apiKey) {
    console.error(
      '[images/sign] missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_IMAGES_KEY'
    )
    return res.status(503).json({ error: 'Image uploads not configured' })
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`

  try {
    const cfRes = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: new FormData(),
    })

    const data = await cfRes.json().catch(() => null)

    if (!cfRes.ok || !data?.success || !data?.result?.uploadURL) {
      console.error('[images/sign] Cloudflare error', {
        status: cfRes.status,
        body: data,
      })
      return res
        .status(502)
        .json({ error: 'Failed to obtain upload URL from Cloudflare' })
    }

    return res.status(200).json({ uploadURL: data.result.uploadURL })
  } catch (err) {
    console.error('[images/sign] unexpected error', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
