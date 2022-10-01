"use strict";
const { users } = require("../../auth/models");

const imageModel = (sequelize, DataTypes) => {
  const model = sequelize.define("Image", {
    title: { type: DataTypes.STRING, required: true },
    assigment: { type: DataTypes.STRING, required: true },
    description: { type: DataTypes.STRING, required: true },
    imgUrl: { type: DataTypes.STRING, required: true },
    // creatorId: { type: DataTypes.INTEGER, required: true },
  });
  model.belongsTo(users, {
    foreignKey: "creatorId",
  });
  return model;
};

module.exports = imageModel;
