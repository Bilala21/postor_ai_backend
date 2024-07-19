const { Model, DataTypes } = require("sequelize");
const { PLATFORMS } = require("../utils/constants");

module.exports = (sequelize) => {
  class PostPlatform extends Model {
    static associate(models) {
      PostPlatform.belongsTo(models.Post, { foreignKey: "post_id" });
    }
  }

  PostPlatform.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      platform_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      platform_post_id: {
        type: DataTypes.ENUM(Object.values(PLATFORMS)),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PostPlatform",
      tableName: "post_platforms",
      underscored: true,
    }
  );

  return PostPlatform;
};
