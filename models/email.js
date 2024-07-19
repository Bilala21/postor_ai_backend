const { Sequelize, DataTypes, Model } = require("sequelize");

/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Model} Model
 */

/**
 * User model definition
 * @param {Sequelize} sequelize - The sequelize instance.
 * @param {DataTypes} DataTypes - The sequelize DataTypes.
 * @returns {Model} - The OTP model.
 */
module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define(
    "Email",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      modelName: "Email",
      tableName: "emails",
      underscored: true,
    }
  );

  return Email;
};
