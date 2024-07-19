const { Model, DataTypes } = require("sequelize");
const { POST_STATUSES } = require("../utils/constants");

module.exports = (sequelize) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: "user_id" });
      Post.hasMany(models.PostMedia, { foreignKey: "post_id", as: "media" });
      Post.hasMany(models.PostPlatform, {
        foreignKey: "post_id",
        as: "post_platforms",
      });
    }
  }

  Post.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT("medium"),
      },
      hashtags: {
        type: DataTypes.TEXT("tiny"),
      },
      platforms: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(Object.values(POST_STATUSES)),
        allowNull: false,
        defaultValue: POST_STATUSES.ACTIVE,
      },
      scheduled_at: {
        type: DataTypes.DATE,
        allowNull: true, // null means post instantly
      }
    },
    {
      sequelize,
      tableName: "posts",
      underscored: true,
    }
  );

  return Post;
};
