import { ApolloServer, gql } from 'apollo-server';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';
import userType from './schema/user';
import teamType from './schema/team';
import messageType from './schema/message';
import channelType from './schema/channel';

import userResolver from './resolvers/user';
import teamResolver from './resolvers/team';
import messageResolver from './resolvers/message';
import channelResolver from './resolvers/channel';

const typesArray = [
  userType,
  teamType,
  messageType,
  channelType
];
const resolversArray = [
  userResolver,
  teamResolver,
  messageResolver,
  channelResolver
];
const typeDefs = mergeTypes(typesArray, { all: true });
const resolvers = mergeResolvers(resolversArray);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    user: {
      id: 1,
    }
  },
});

models.sequelize.sync().then(() => {
  server.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  )
})
