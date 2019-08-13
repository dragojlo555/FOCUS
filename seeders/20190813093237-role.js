'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [{
      id: '1',
      code: 'Creator',
      createdAt: new Date(),
      updatedAt: new Date()
    },{   id: '2',
      code: 'Standard',
      createdAt: new Date(),
      updatedAt: new Date()},
      {   id: '3',
        code: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
