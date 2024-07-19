const { Sequelize, DataTypes, Model } = require("sequelize");
const { MODEL_OPTS, USER_ROLES } = require("../utils/constants");

/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Model} Model
 */

/**
 * User model definition
 * @param {Sequelize} sequelize - The sequelize instance.
 * @param {DataTypes} DataTypes - The sequelize DataTypes.
 * @returns {Model} - The User model.
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM(Object.values(USER_ROLES)),
        defaultValue: USER_ROLES.PERSONAL,
      },
      facebook_id: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true,
      },
      facebook_access_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      instagram_id: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true,
      },
      instagram_access_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      ...MODEL_OPTS,
      modelName: "User",
      tableName: "users",
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: "user_id",
      as: "posts",
    });
  };

  return User;
};
