import "@babel/polyfill/noConflict"
import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Tournament from './resolvers/Tournament'
import Match from './resolvers/Match'
import Player from './resolvers/Player'
import prisma from './prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Tournament,
    Match,
    Player
  },
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request
    }
  }
})

const PORT = process.env.PORT || 4000
server.start({ port: PORT }, () => console.log(`The server is up on port ${PORT}`))