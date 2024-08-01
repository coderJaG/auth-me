'use strict';
const {Spot} = require('../models')
let options = {};
if(process.env.schema === 'production'){
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '106 and Parks',
        city: 'Channel 98',
        state: 'GA',
        country: 'USA',
        lat: 78.0621,
        lng: -125.2563,
        name: 'The Fun Place',
        description: 'This is the place to be if you want to have a fun summer and not a bum summer',
        price: 200.99
      },
      {
        ownerId: 2,
        address: '446 Summer Lane',
        city: 'Sun City',
        state: 'FL',
        country: 'USA',
        lat: 75.0621,
        lng: 34.2563,
        name: 'The Grand Fun Place',
        description: 'Want to have some fun? This is the place to be if you want to have a fun summer and not a bum summer',
        price: 102.25
      },

    ], options)
  },

  async down (queryInterface, Sequelize) {
  
    options.tableName = 'Spots'
     return queryInterface.bulkDelete(options, {});
     
  }
};
