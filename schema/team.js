import { gql } from "apollo-server";

export default gql`
  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
  type CreateTeamResponse {
    success: Boolean!
    errors: [Error!]
  }
  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
  }
`;
