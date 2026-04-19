import { ApolloServer } from 'apollo-server-micro'
import type { NextApiRequest, NextApiResponse } from 'next'

import context from '~/graphql/context'
import withRateLimit from '~/graphql/helpers/withRateLimit'
import resolvers from '~/graphql/resolvers'
import typeDefs from '~/graphql/typeDefs'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

// apollo-server v3 requires `server.start()` before `createHandler()`.
// Memoize the start promise so concurrent cold invocations share one init.
const startServer = apolloServer.start()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await startServer
  return apolloServer.createHandler({ path: '/api/graphql' })(req, res)
}

export default withRateLimit(handler)
