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
      through: models.Member,
      foreignKey: "team_id"
    });
  };

  return Team;
};
