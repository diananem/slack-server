import { gql } from "apollo-server";

export default gql`
  type DirectMessage {
    id: Int!
    text: String!
    sender: User!
    receiver_id: Int!
    created_at: String!
  }

  type Query {
    directMessages(team_id: Int!, other_user_id: Int!): [DirectMessage!]!
  }
  type Mutation {
    createDirectMessage(
      receiver_id: Int!
      text: String!
      team_id: Int!
    ): Boolean!
  }
`;
