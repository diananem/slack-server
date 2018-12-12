import { ApolloServer, gql } from "apollo-server";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import path from "path";

import models from "./models";

const SECRET = "dsahvjsblfbf5738yrhu";
const SECRET2 = "dsahvjsblfbf573wewdqwd";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    user: {
      id: 1
    },
    SECRET,
    SECRET2
  }
});

models.sequelize.sync().then(() => {
  server.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
