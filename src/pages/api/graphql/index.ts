import { makeExecutableSchema } from '@graphql-tools/schema'
import type { NextApiRequest, NextApiResponse } from 'next'
import { execute, parse, specifiedRules, validate } from 'graphql'

import { getContext } from '~/graphql/context'
import withRateLimit from '~/graphql/helpers/withRateLimit'
import resolvers from '~/graphql/resolvers'
import typeDefs from '~/graphql/typeDefs'

// Build schema once at module load time (not per request)
const schema = makeExecutableSchema({ typeDefs, resolvers })

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  const contextValue = await getContext(req, res)
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
