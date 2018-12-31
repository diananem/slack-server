import formatErrors from "../formatErrors";

export default {
  Mutation: {
    createChannel: async (parents, args, { models }) => {
      try {
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
  }
};
