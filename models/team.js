export default (sequelize, DataTypes) => {
  const Team = sequelize.define("team", {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "Name can contain only letters and numbers"
        },
        len: {
          args: [3, 15],
          msg: "Name can be between 3 and 15 characters long"
        }
      }
    }
  });

  Team.associate = models => {
    Team.belongsToMany(models.User, {
      through: "member",
      foreignKey: "team_id"
    });
    Team.belongsTo(models.User, {
      foreignKey: "owner"
    });
  };

  return Team;
};
