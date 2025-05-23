'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Purchase.belongsTo(models.Restaurant, {
        foreignKey: "restaurantId",
      });
      Purchase.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    
  }
  Purchase.init({
    
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Restaurants",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
        },
        onDelete: "CASCADE",
      },
      
        },
    {
      sequelize,
      modelName: "Purchase",
      defaultScope: {
        attributes: {
          exclude: ["updatedAt", "createdAt"],
        },
      },
      
  }, {
    sequelize,
    modelName: 'Purchase',
  });
  return Purchase;
};