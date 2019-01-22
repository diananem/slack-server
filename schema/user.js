import { gql } from "apollo-server";

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }
  type Query {
    getUser: User!
    getAllUsers: [User!]!
    getDirectMessageUser(user_id: Int!): User
  }
  type RegisterResponse {
    success: Boolean!
    user: User
    token: String
    errors: [Error!]
  }

  type LoginResponse {
    success: Boolean!
    token: String
    errors: [Error!]
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
    ): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }
`;
