"use strict";

const { USER_ROLES } = require("../utils/constants");

const tableName = "users";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (qI, Sequelize) =>
    qI.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: Sequelize.ENUM(Object.values(USER_ROLES)),
        defaultValue: USER_ROLES.PERSONAL,
      },
      facebook_id: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: true,
      },
      facebook_access_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      instagram_id: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: true,
      },
      instagram_access_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }),
  down: (qI) => qI.dropTable(tableName),
};
