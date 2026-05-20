/*
Apollo client for build-time data fetching from `getStaticProps`. Uses
SchemaLink to execute resolvers in-process, eliminating the self-network call
that the previous HttpLink-based SSR did.

This file pulls in the GraphQL schema, all resolvers, and Prisma — it must
NEVER be imported from any module that ends up in the client bundle. Only
import it inside `getStaticProps` / `getServerSideProps` (which Next strips
from client bundles automatically).

Viewer is always null at this layer:
  • ISR/SSG: pages are anonymous static HTML by definition.
  • Personalization (isAdmin controls, reaction state, comment ownership) is
    fetched client-side via useViewerQuery, which goes through the real
    /api/graphql endpoint with the browser's session cookie attached.
*/

import { SchemaLink } from '@apollo/client/link/schema'

import { schema } from '~/graphql/schema'
import { prisma } from '~/lib/prisma'

import { createApolloClient } from './index'

export function initStaticApolloClient() {
  const link = new SchemaLink({
    schema,
    context: { viewer: null, prisma },
  })

  return createApolloClient({ link })
}
