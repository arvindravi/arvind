import * as postmark from 'postmark'

import { baseEmail } from '~/config/seo'
import { IS_PROD } from '~/graphql/constants'

// Read both names for backwards-compat with old env files.
const POSTMARK_TOKEN =
  process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_CLIENT_ID

// Defer client creation so a missing/placeholder token doesn't crash module load
// (which would break the entire GraphQL server, since email is imported transitively by resolvers).
let _client: postmark.ServerClient | null = null
function getClient(): postmark.ServerClient | null {
  if (!POSTMARK_TOKEN || POSTMARK_TOKEN.startsWith('your-')) return null
  if (!_client) _client = new postmark.ServerClient(POSTMARK_TOKEN)
  return _client
}

// Proxy that forwards any method to the real ServerClient when a token is set,
// otherwise logs a warning and resolves successfully so callers don't crash.
export const client = new Proxy({} as postmark.ServerClient, {
  get(_target, prop: string) {
    const c = getClient()
    if (c) return (c as unknown as Record<string, Function>)[prop].bind(c)
    return (...args: unknown[]) => {
      console.warn(
        `[postmark] No valid POSTMARK_SERVER_TOKEN — ${prop} skipped.`,
        args
      )
      return Promise.resolve({ skipped: true })
    }
  },
})

interface EmailMeProps {
  subject: string
  body: string
}

export function emailMe({ subject, body }: EmailMeProps) {
  if (!IS_PROD) {
    return console.log('Sending Postmark email: ', {
      From: baseEmail,
      To: baseEmail,
      Subject: subject,
      TextBody: body,
    })
  }

  return client.sendEmail({
    From: baseEmail,
    To: baseEmail,
    Subject: subject,
    TextBody: body,
  })
}
