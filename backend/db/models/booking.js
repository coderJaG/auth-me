'use strict';
const {
  Model
} = require('sequelize');

// check if date entered is valid helper function
const isValidDate = (value) => {
  const dateFormat = /^\d{2}\/\d{2}\/\d{2}\$/
  if (!dateFormat.test(value)) {
    throw new Error('Date must be in the format MM/DD/YYYY')
  }
  const [mm, dd, yy] = value.split('/');
  const month = +mm;
  const day = +dd;
  const year = +yy;
  
  const date = new Date(year, month - 1, day)

  if(date.getFullYear() === year && date.getMonth() === (month - 1) && date.getDate() === day){
    return date
  }
}

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot,{
        foreignKey: 'spotId'               
      });
      Booking.belongsTo(models.User,{
        foreignKey: 'userId'                
      });
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10,10],
        isBeforeToday(value) {
          const dateCheck = isValidDate(value)
          const today = new Date();
          if (dateCheck < today){
            throw new Error('Cannot be before today\'s date')
          }
        }
      }
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10,10],
        isBeforeStartDate(value) {
          const dateCheck = isValidDate(value)
          if (dateCheck < Booking.startDate){
            throw new Error('Cannot be before start date')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};