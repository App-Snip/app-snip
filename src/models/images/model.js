"use strict";
// const { users } = require("../../auth/models");

const imageModel = (sequelize, DataTypes) =>
  sequelize.define("Image", {
    title: { type: DataTypes.STRING, required: true },
    assigment: { type: DataTypes.STRING, required: true },
    description: { type: DataTypes.STRING, required: true },
    imgUrl: { type: DataTypes.STRING, required: true },
    ownerId: { type: DataTypes.INTEGER, required: true },
  });

module.exports = imageModel;
