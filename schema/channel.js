import { gql } from "apollo-server";

export default gql`
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }

  type ChannelResponse {
    success: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type Mutation {
    createChannel(
      team_id: Int!
      name: String!
      public: Boolean = false
    ): ChannelResponse!
  }
`;
