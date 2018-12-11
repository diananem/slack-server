import { gql } from 'apollo-server';

export default gql`
type User {
  id: Int!
  username: String!
  email: String!
  teams: [Team!]!
}
type Query {
  getUser(id: Int!): User!
  getAllUsers: [User!]!
}
type RegisterResponce {
  success: Boolean!
  user: User
  errors: [Error!]
}

type LoginResponce {
  success: Boolean!
  token: String
  refreshToken: String
  errors: [Error!]
}
type Mutation {
  register(username: String!, email: String!, password: String!): RegisterResponce!
  login(email: String!, password: String!): LoginResponce!
}
`;