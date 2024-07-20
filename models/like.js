'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Like extends Model {
    static associate(models) {
      // Define associations here if needed
      Like.belongsTo(models.Post, { foreignKey: 'post_id' });
      Like.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Like.init({
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
    timestamps: false,
    underscored: true,
  });

  return Like;
};
