'use strict';

const { Image } = require('../models')
let options = {};
if (process.env.schema === 'production') {
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Image.bulkCreate([
      {
        imageableId: 1,
        imageableType: 'Spot',
        url: '../../image/image-1png',
        preview: true
      },
      {
        imageableId: 2,
        imageableType: 'Spot',
        url: '../../image/image-2png',
        preview: false
      },
      {
        imageableId: 2,
        imageableType: 'Review',
        url: '../../image/image-2png',
        preview: true
      }
    ])
  },


  async down(queryInterface, Sequelize) {

    options.tableName = 'Images'
    return queryInterface.bulkDelete(options, {});
  }

};
