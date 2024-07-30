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
        foreignKey: 'spotId'
      });
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Review.hasMany(models.Image, {
        foreignKey: 'imageableId',
        onDelete: 'CASCADE',
        hooks: true,
        constraints: false,  
        scope: {
          imageableType: 'Review'
        }
      })
    }
  }
  Review.init({

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value){
          if(!value){
            throw new Error('Review text is required');
          };
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        isDecimal: false,
        isValid(value){
          if(value < 1 || value > 5){
            throw new Error('Stars must be an integer from 1 to 5');
          };
        },
      }
    },

  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};