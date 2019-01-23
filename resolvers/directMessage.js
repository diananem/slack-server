import requiresAuth from "../permissions";
import { pubsub } from "../index";
import { withFilter } from "apollo-server";

const DIRECT_MESSAGE_ADDED = "DIRECT_MESSAGE_ADDED";

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

          pubsub.publish(`${DIRECT_MESSAGE_ADDED}-${args.team_id}`, {
            team_id: args.team_id,
            sender_id: user.id,
            receiver_id: args.receiver_id,
            directMessageAdded: {
              ...directMessage.dataValues,
              sender: {
                username: user.username
              }
            }
          });

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      }
    )
  },
  Subscription: {
    directMessageAdded: {
      subscribe: withFilter(
        (root, args) =>
          pubsub.asyncIterator(`${DIRECT_MESSAGE_ADDED}-${args.team_id}`),
        (payload, variables, { user }) => {
          return (
            payload.directMessageAdded.team_id === variables.team_id &&
            ((payload.directMessageAdded.sender_id === user.id &&
              payload.directMessageAdded.receiver_id === variables.user_id) ||
              (payload.directMessageAdded.sender_id === variables.user_id &&
                payload.directMessageAdded.receiver_id === user.id))
          );
        }
      )
    }
  }
};
