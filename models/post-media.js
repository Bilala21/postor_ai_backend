const { Model, DataTypes } = require("sequelize");
const { MEDIA_TYPES } = require("../utils/constants");

module.exports = (sequelize) => {
  class PostMedia extends Model {
    static associate(models) {
      PostMedia.belongsTo(models.Post, { foreignKey: "post_id" });
    }
  }

  PostMedia.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "post_medias",
      modelName: "PostMedia",
      underscored: true,
    }
  );

  return PostMedia;
};
