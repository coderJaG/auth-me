'use strict';
const {
  Model
} = require('sequelize');

// check if date entered is valid helper function
const isValidDate = (value) => {
  const dateFormat = /^\d{4}\-\d{2}\-\d{2}$/
  if (!dateFormat.test(value)) {
    throw new Error('Date must be in the format MM/DD/YYYY')
  }
  const [yy, mm, dd] = value.split('-');
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
            throw new Error('startDate cannot be in the past')
          }
        }
      }
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10,10],
        isBeforeStartDateOrToday(value) {
          const today = new Date();
          const dateCheck = isValidDate(value)
          const startDate = isValidDate(this.getDataValue('startDate'))
          if (dateCheck <= startDate ){
            throw new Error('endDate cannot be on or before startDate')
          };    
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};