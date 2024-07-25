'use strict';

const { UserSpot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await UserSpot.bulkCreate([
      {
        spotId: 1,
        ownerId: 2
      },
      {
        spotId: 2,
        ownerId: 1
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'UserSpots'
    return queryInterface.bulkDelete(options, {}); 
  }
};
