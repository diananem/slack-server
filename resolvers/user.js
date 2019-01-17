import { tryLogin, createTokens } from "../auth";
import formatErrors from "../formatErrors";

export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    getAllUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET }) =>
      tryLogin(email, password, models, SECRET),
    register: async (parent, args, { models, SECRET }) => {
      try {
        const user = await models.User.create(args);
        return {
          success: true,
          user,
          token: createTokens(user, SECRET)
        };
      } catch (err) {
        return {
          success: false,
          errors: formatErrors(err, models)
        };
      }
    }
  }
};
