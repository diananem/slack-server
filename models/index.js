import Sequelize from "sequelize";

const sequelize = new Sequelize("slack", "dianka", "postgres", {
  dialect: "postgres",
  operatorsAliases: Sequelize.Op,
  define: {
    underscored: true
  }
});

const models = {
  User: sequelize.import("./user"),
  Team: sequelize.import("./team"),
  Message: sequelize.import("./message"),
  Channel: sequelize.import("./channel"),
  Member: sequelize.import("./member"),
  DirectMessage: sequelize.import("./directMessage")
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
