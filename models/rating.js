'use strict';

const { Model, DataTypes } = require('sequelize');
const { POST_STATUSES } = require('../utils/constants');

module.exports = (sequelize) => {
  class Rating extends Model {
    static associate(models) {
      // Define associations here if needed
      Rating.belongsTo(models.Post, { foreignKey: 'post_id' });
      Rating.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Rating.init({
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts', // Ensure this matches the table name defined in the migration
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Ensure this matches the table name defined in the migration
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    timestamps: true,
    underscored: true,
  });

  return Rating;
};
