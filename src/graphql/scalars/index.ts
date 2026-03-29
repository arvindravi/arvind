import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value: unknown) {
    return new Date(value as string | number | Date) // value from the client
  },
  serialize(value: unknown) {
    return (value as Date).getTime() // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)) // ast value is always in string format
    }
    return null
  },
})
