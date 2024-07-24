"use strict";

const { POST_STATUSES } = require('../utils/constants');

const tableName = "posts";

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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.TEXT("tiny"),
        allowNull: false,
      },
      desc: {
        type: Sequelize.TEXT("medium"),
      },
      hashtags: {
        type: Sequelize.TEXT("tiny"),
      },
      platforms: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(Object.values(POST_STATUSES)),
        allowNull: false,
        defaultValue: POST_STATUSES.ACTIVE,
      },
      scheduled_at: {
        type: Sequelize.DATE,
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
