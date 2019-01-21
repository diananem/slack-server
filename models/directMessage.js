export default (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define("direct_message", {
    text: DataTypes.STRING
  });

  DirectMessage.associate = models => {
    DirectMessage.belongsTo(models.Team, {
      foreignKey: "team_id"
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: "receiver_id"
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: "sender_id"
    });
  };

  return DirectMessage;
};
