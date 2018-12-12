export default {
  Mutation: {
    createMessage: async (parents, args, { models, user }) => {
      try {
        await models.Message.create({ ...args, user_id: user.id });
        return true;
      } catch (err) {
        console.error(err)
        return false;
      }
    }
  }
};