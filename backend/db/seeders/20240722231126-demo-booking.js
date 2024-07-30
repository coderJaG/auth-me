'use strict';

const {Booking} = require('../models')
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([{
      spotId: 1,
      userId: 1,
      startDate: '2023-11-04',
      endDate: '2023-12-04'
    },
    {
      spotId: 2,
      userId: 2,
      startDate: '2025-11-01',
      endDate: '2025-12-02'
    },
    {
      spotId: 1,
      userId: 1,
      startDate: '2024-11-04',
      endDate: '2024-12-04'
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews'
    await queryInterface.bulkDelete(options)
  }
};
