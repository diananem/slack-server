import { ApolloServer, gql } from "apollo-server";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import jwt from "jsonwebtoken";
import path from "path";

import models from "./models";

const SECRET = "dsahvjsblfbf5738yrhu";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || null;

    let user = null;
    if (token) {
      try {
        user = jwt.verify(token.split(" ")[1], SECRET).user;
      } catch (err) {
        console.error(err);
      }
    }

    return {
      models,
      user,
      SECRET
    };
  }
});

models.sequelize.sync().then(() => {
  server.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
