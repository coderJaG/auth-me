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
        url: 'https://picsum.photos/id/33/5000/3333.jpg',
        preview: true
      },
      {
        imageableId: 2,
        imageableType: 'Spot',
        url: 'https://picsum.photos/id/37/2000/1333.jpg',
        preview: true
      },
      {
        imageableId: 2,
        imageableType: 'Review',
        url: 'https://picsum.photos/id/38/1280/960.jpg',
        preview: true
      }
    ])
  },


  async down(queryInterface, Sequelize) {

    options.tableName = 'Images'
    return queryInterface.bulkDelete(options, {});
  }

};
