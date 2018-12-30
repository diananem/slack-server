import jwt from "jsonwebtoken";
import _ from "lodash";
import bcrypt from "bcrypt";

export const createTokens = async (user, secret) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ["id", "username"])
    },
    secret,
    {
      expiresIn: "1h"
    }
  );

  return createToken;
};

export const tryLogin = async (email, password, models, SECRET) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    // user with provided email not found
    return {
      success: false,
      errors: [{ path: "email", message: "Wrong email" }]
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    return {
      success: false,
      errors: [{ path: "password", message: "Wrong password" }]
    };
  }

  const token = await createTokens(user, SECRET);

  return {
    success: true,
    token
  };
};
