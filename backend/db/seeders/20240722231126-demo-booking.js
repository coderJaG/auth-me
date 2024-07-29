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
      startDate: '11/04/2024',
      endDate: '12/04/2024'
    },
    {
      spotId: 2,
      userId: 2,
      startDate: '01/11/2025',
      endDate: '02/06/2025'
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
