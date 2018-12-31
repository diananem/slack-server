import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) =>
        models.Team.findAll({ where: { owner: user.id } }, { raw: true })
    )
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({ ...args, owner: user.id });
            await models.Channel.create({
              name: "general",
              public: true,
              team_id: team.id
            });
            return team;
          });

          return {
            success: true,
            team: response
          };
        } catch (err) {
          return {
            success: false,
            errors: formatErrors(err, models)
          };
        }
      }
    ),
    addTeamMember: requiresAuth.createResolver(
      async (parent, { email, team_id }, { models, user }) => {
        try {
          const teamPromise = await models.Team.findOne(
            { where: { id: team_id } },
            { raw: true }
          );
          const userToAddPromise = await models.User.findOne(
            { where: { email } },
            { raw: true }
          );
          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise
          ]);

          if (team.owner !== user.id) {
            return {
              success: false,
              errors: [
                { path: "email", message: "You cannot add members to the team" }
              ]
            };
          }
          if (!userToAdd) {
            return {
              success: false,
              errors: [
                {
                  path: "email",
                  message: "Could not find user with this email"
                }
              ]
            };
          }

          await models.Member.create({ user_id: userToAdd.id, team_id });
          return {
            success: true
          };
        } catch (err) {
          // console.error(err);
          return {
            success: false,
            errors: formatErrors(err, models)
          };
        }
      }
    )
  },
  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { team_id: id } })
  }
};
