import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value as string | number)
  },
  serialize(value) {
    return (value as Date).getTime()
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10))
    }
    return null
  },
})
