import { createYoga } from 'graphql-yoga'
import { schema } from './schema'

export const POST = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql', // GraphQL のエンドポイント
})
