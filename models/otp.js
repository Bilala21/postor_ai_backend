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
  const Otp = sequelize.define(
    "Otp",
    {
      code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_expired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      underscored: true,
      modelName: "Otp",
      tableName: "otps",
    }
  );

  return Otp;
};
