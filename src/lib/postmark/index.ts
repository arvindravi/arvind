import * as postmark from 'postmark'

import { baseEmail } from '~/config/seo'
import { IS_PROD } from '~/graphql/constants'

// Lazy-init: only create the client when actually sending — avoids crashing
// at module load time when POSTMARK_CLIENT_ID is not set (e.g. preview envs).
// `client` is exported as a Proxy so callers using `import { client }` keep
// working without any changes.
function getClient() {
  return new postmark.ServerClient(process.env.POSTMARK_CLIENT_ID ?? '')
}

export const client = new Proxy({} as postmark.ServerClient, {
  get(_target, prop) {
    return (...args: any[]) => (getClient() as any)[prop](...args)
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

  return getClient().sendEmail({
    From: baseEmail,
    To: baseEmail,
    Subject: subject,
    TextBody: body,
  })
}
