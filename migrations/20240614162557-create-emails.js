"use strict";

const tableName = "emails";

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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
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
