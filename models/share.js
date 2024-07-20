'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Share extends Model {
    static associate(models) {
      // Define associations here if needed
      Share.belongsTo(models.Post, { foreignKey: 'post_id' });
      Share.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Share.init({
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Share',
    tableName: 'shares',
    timestamps: false,
    underscored: true,
  });

  return Share;
};
