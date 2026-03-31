import { makeExecutableSchema } from '@graphql-tools/schema'
import type { NextApiRequest, NextApiResponse } from 'next'
import { execute, parse, specifiedRules, validate } from 'graphql'

import { getContext } from '~/graphql/context'
import withRateLimit from '~/graphql/helpers/withRateLimit'
import resolvers from '~/graphql/resolvers'
import typeDefs from '~/graphql/typeDefs'

// Build schema once at module load time (not per request).
// Wrapped in try/catch so a schema-build failure returns JSON instead of
// crashing the entire module and making Next.js serve an HTML 500 page.
let schema: ReturnType<typeof makeExecutableSchema> | null = null
let schemaInitError: string | null = null

try {
  schema = makeExecutableSchema({ typeDefs, resolvers })
} catch (err: any) {
  schemaInitError = err?.message ?? String(err)
  console.error('[graphql] Schema initialization failed:', err)
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Surface schema-init errors as proper JSON so they're debuggable
  if (!schema) {
    return res.status(500).json({
      errors: [{ message: `GraphQL schema failed to initialize: ${schemaInitError}` }],
    })
  }

  // Only accept POST
  if (req.method !== 'POST') {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] })
    return
  }

  const { query, variables, operationName } = req.body ?? {}

  if (!query || typeof query !== 'string') {
    res.status(400).json({ errors: [{ message: 'Must provide a query string.' }] })
    return
  }

  // Parse
  let document
  try {
    document = parse(query)
  } catch (syntaxError) {
    res.status(400).json({ errors: [syntaxError] })
    return
  }

  // Validate
  const validationErrors = validate(schema, document, specifiedRules)
  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors })
    return
  }

  // Execute
  let contextValue
  try {
    contextValue = await getContext(req, res)
  } catch (err: any) {
    console.error('[graphql] Context initialization failed:', err)
    return res.status(500).json({
      errors: [{ message: `Context initialization failed: ${err?.message ?? String(err)}` }],
    })
  }

  const result = await execute({
    schema,
    document,
    variableValues: variables,
    operationName,
    contextValue,
  })

  res.status(200).json(result)
}

export default withRateLimit(handler)
