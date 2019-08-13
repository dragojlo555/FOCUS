'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Focus', [{
      id: '1',
      state:'offline',
      userId:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: '2',
      state:'offline',
      userId:2,
      createdAt: new Date(),
      updatedAt: new Date()},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Focus', null, {});
  }
};
