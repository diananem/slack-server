import { tryLogin, createTokens } from "../auth";
import formatErrors from "../formatErrors";
import requiresAuth from "../permissions";

export default {
  User: {
    teams: (parent, args, { models, user }) =>
      models.sequelize.query(
        "SELECT * FROM teams AS team JOIN members AS member ON team.id = member.team_id WHERE member.user_id = ?",
        {
          replacements: [user.id],
          model: models.Team,
          raw: true
        }
      )
  },
  Query: {
    getAllUsers: (parent, args, { models }) => models.User.findAll(),
    getUser: requiresAuth.createResolver((parent, args, { models, user }) =>
      models.User.findOne({ where: { id: user.id } })
    ),
    getDirectMessageUser: (parent, { user_id }, { models }) =>
      models.User.findOne({ where: { id: user_id } })
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
