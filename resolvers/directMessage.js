import requiresAuth from "../permissions";

const MESSAGE_ADDED = "MESSAGE_ADDED";

export default {
  DirectMessage: {
    sender: ({ sender, sender_id }, args, { models }) => {
      if (sender) {
        return sender;
      }
      return models.User.findOne({ where: { id: sender_id } }, { raw: true });
    }
  },
  Query: {
    directMessages: requiresAuth.createResolver(
      async (parent, { team_id, other_user_id }, { models, user }) =>
        models.DirectMessage.findAll(
          {
            order: [["created_at", "ASC"]],
            where: {
              team_id,
              [models.sequelize.Op.or]: [
                {
                  [models.sequelize.Op.and]: [
                    { receiver_id: other_user_id },
                    { sender_id: user.id }
                  ]
                },
                {
                  [models.sequelize.Op.and]: [
                    { receiver_id: user.id },
                    { sender_id: other_user_id }
                  ]
                }
              ]
            }
          },
          { raw: true }
        )
    )
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(
      async (parents, args, { models, user }) => {
        try {
          const directMessage = await models.DirectMessage.create({
            ...args,
            sender_id: user.id
          });

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      }
    )
  }
};
