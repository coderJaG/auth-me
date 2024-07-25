'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });
      Review.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope : {
          imageableType: 'Review'
        }
      })
    }
  }
  Review.init({
    review: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        isDecimal: false,
        min: 1,
        max: 5
      }
    },
    spotId:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};