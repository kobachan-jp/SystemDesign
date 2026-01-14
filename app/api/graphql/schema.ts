import { createSchema } from 'graphql-yoga'
import prisma from '@/app/lib/prisma'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Museum {
      id: Int!
      name: String!
      address: String!
      officialUrl: String!
      description: String
      exhibitions: [Exhibition!]!
    }

    type Exhibition {
      id: Int!
      title: String!
      startDate: String!
      endDate: String!
      officialUrl: String!
      description: String
      museum: Museum!
    }

    type Query {
      exhibitions(limit: Int): [Exhibition!]!
      exhibition(id: Int!): Exhibition
      museums: [Museum!]!
      museum(id: Int!): Museum
    }
  `,

  resolvers: {
    Query: {
      // 展覧会一覧
      exhibitions: async (_parent, args) => {
        return prisma.exhibition.findMany({
          include: {
            museum: true,
          },
          orderBy: { id: 'desc' },
          take: args.limit,
        })
      },

      // 展覧会1件
      exhibition: async (_parent, args) => {
        return prisma.exhibition.findUnique({
          where: { id: args.id },
          include: {
            museum: true,
          },
        })
      },
      //美術館一覧
      museums: async () => {
        return prisma.museum.findMany({
          include: { exhibitions: true },
        })
      },
      //美術館一件
      museum: async (_parent, args) => {
        return prisma.museum.findUnique({
          where: { id: args.id },
          include: { exhibitions: true },
        })
      },
    },
  },
})
