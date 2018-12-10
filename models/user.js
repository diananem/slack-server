import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "Username can contain only letters and numbers",
        },
        len: {
          args: [3, 15],
          msg: "Username can be between 3 and 15 characters long",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email!",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: "The password needs to be between 5 and 100 characters long"
        },
      },
    },
  },
    {
      hooks: {
        afterValidate: async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.password = hashedPassword;
        },
      },
    },
  );

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: 'user_id',
    });
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: 'user_id',
    })
  };

  return User;
};