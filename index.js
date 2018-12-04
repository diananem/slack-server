import { ApolloServer, gql } from 'apollo-server';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const server = new ApolloServer({ typeDefs, resolvers });

models.sequelize.sync().then(() => {
  server.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  )
})
