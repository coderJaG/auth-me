'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      });
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotID',
        onDelete: 'CASCADE',
        hooks: true
      });
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });
      Spot.hasMany(models.Image, {
        foreignKey: 'imageableId',
        onDelete: 'CASCADE',
        hooks: true,
        constraints: false,
        scope: {
          imageableType: 'Spot'
      }
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
       isValid(value){
        if(!value){
          throw new Error('Street address is required')
        }
       }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value){
          if(!value){
            throw new Error('City is required')
          }
         }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value){
          if(!value){
            throw new Error('State is required')
          }
         }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value){
          if(!value){
            throw new Error('Country is required')
          }
         }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isValid (value){
          if (value < -90 || value > 90){
            throw new Error('Latitiude must be between -90 and 90')
          }
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isValid (value){
          if (value < -180 || value > 1800){
            throw new Error('Longitiude must be between -180 and 180')
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isValid(value){
          if(value.length  > 50 ){
            throw new Error("Name must be less than 50 characters");
          }
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value){
          if(!value){
            throw new Error('Description is required')
          }
         }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isFloat: {
          min: 1,
          msg: "Price per day must be a positive number"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};