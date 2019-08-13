'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserTeams', [{
      id: '1',
      active:0,
      userId:1,
      teamId:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: '2',
      active:0,
      userId:1,
      teamId:2,
      createdAt: new Date(),
      updatedAt: new Date()},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserTeams', null, {});
  }
};
