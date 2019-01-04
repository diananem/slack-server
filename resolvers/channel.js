import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (parents, args, { models, user }) => {
        try {
          const team = await models.Team.findOne(
            { where: { id: args.team_id } },
            { raw: true }
          );
          if (team.owner !== user.id) {
            return {
              success: false,
              errors: [
                { path: "name", message: "You are not the owner of this team" }
              ]
            };
          }
          const channel = await models.Channel.create(args);
          return {
            success: true,
            channel
          };
        } catch (err) {
          console.error(err);
          return {
            success: false,
            errors: formatErrors(err, models)
          };
        }
      }
    )
  }
};
