import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (parents, args, { models, user }) => {
        try {
          const member = await models.Member.findOne(
            { where: { team_id: args.team_id, user_id: user.id } },
            { raw: true }
          );
          if (!member.admin) {
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
