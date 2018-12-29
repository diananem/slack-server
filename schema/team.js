import { gql } from "apollo-server";

export default gql`
  type Team {
    id: Int!
    name: String!
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
  type CreateTeamResponse {
    success: Boolean!
    team: Team!
    errors: [Error!]
  }

  type Query {
    allTeams: [Team!]!
  }

  type VoidResponse {
    success: Boolean!
    errors: [Error!]
  }
  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
    addTeamMember(email: String!, team_id: Int!): VoidResponse!
  }
`;
