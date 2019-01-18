import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({ ...args });
            await models.Channel.create({
              name: "general",
              public: true,
              team_id: team.id
            });
            await models.Member.create({
              team_id: team.id,
              user_id: user.id,
              admin: true
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
          const memberPromise = await models.Member.findOne(
            { where: { team_id, user_id: user.id } },
            { raw: true }
          );
          const userToAddPromise = await models.User.findOne(
            { where: { email } },
            { raw: true }
          );
          const [member, userToAdd] = await Promise.all([
            memberPromise,
            userToAddPromise
          ]);

          if (!member.admin) {
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
