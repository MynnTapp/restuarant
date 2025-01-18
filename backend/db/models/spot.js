"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Restaurant.hasMany(models.Review, {
        foreignKey: "restuarantId",
        onDelete: "CASCADE",
      });
      Restaurant.hasMany(models.Purchase, { foreignKey: "restaurantId", onDelete: "CASCADE" });

      Restaurant.hasMany(models.RestaurantImage, {
        foreignKey: "restaurantId",
        onDelete: "CASCADE",
      });

      Restaurant.belongsTo(models.User, {
        as: "Owner",
        foreignKey: "ownerId",
        onDelete: "CASCADE",
      });
    }
  }
  Restaurant.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNul: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "Restaurant",
    }
  );
  return Restaurant;
};