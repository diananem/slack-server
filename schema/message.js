import { gql } from 'apollo-server';

export default gql`

type Message {
  id: Int!
  text: String!
  user: User!
  channnel: Channel!
}
type Mutation {
  createMessage(channel_id: Int!, text: String!): Boolean!
}
`;