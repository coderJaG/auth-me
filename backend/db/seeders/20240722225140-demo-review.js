'use strict';

const {Review} = require("../models");

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
    await Review.bulkCreate([
      {
      review: 'This is a good spot',
      stars: 4,
      spotId: 2
    },
    {
      review: 'This is not a good spot',
      stars: 1,
      spotId: 1
    },
    {
      review: 'This is not a good spot',
      stars: 5,
      spotId: 1
    },

  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews'
   return queryInterface.bulkDelete(options)
  }
};
