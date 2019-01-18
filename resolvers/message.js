import requiresAuth from "../permissions";
import { pubsub } from "../index";
import { withFilter } from "apollo-server";

const MESSAGE_ADDED = "MESSAGE_ADDED";

export default {
  Message: {
    user: ({ user, user_id }, args, { models }) => {
      if (user) {
        return user;
      }
      return models.User.findOne({ where: { id: user_id } });
    }
  },
  Query: {
    messages: requiresAuth.createResolver(
      async (parent, { channel_id }, { models, user }) =>
        models.Message.findAll(
          { order: [["created_at", "ASC"]], where: { channel_id } },
          { raw: true }
        )
    )
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (parents, args, { models, user }) => {
        try {
          const message = await models.Message.create({
            ...args,
            user_id: user.id
          });
          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: {
                id: user.id
              }
            });
            pubsub.publish(`${MESSAGE_ADDED}-${args.channel_id}`, {
              channel_id: args.channel_id,
              messageAdded: {
                ...message.dataValues,
                user: currentUser.dataValues
              }
            });
          };
          asyncFunc();

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      }
    )
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (root, args) =>
          pubsub.asyncIterator(`${MESSAGE_ADDED}-${args.channel_id}`),
        (payload, variables) => {
          return payload.messageAdded.channel_id === variables.channel_id;
        }
      )
    }
  }
};
