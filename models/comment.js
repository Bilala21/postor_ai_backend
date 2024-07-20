'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      // Define associations here if needed
      Comment.belongsTo(models.Post, { foreignKey: 'post_id' });
      Comment.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Comment.init({
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
    content: {
      type: DataTypes.TEXT,
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
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    underscored: true,
  });

  return Comment;
};
