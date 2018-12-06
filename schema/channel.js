import { gql } from 'apollo-server';

export default gql`

type Channel {
  id: Int!
  name: String!
  public: Boolean!
  messages: [Message!]!
  users: [User!]!
}
type Mutation {
  createChannel(team_id: Int!, name: String!, public: Boolean=false): Boolean!
}
`;