'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('RoleUserTeams', [{
      id: '1',
      userTeamId:1,
      roleId:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: '2',
      userTeamId:2,
      roleId:1,
      createdAt: new Date(),
      updatedAt: new Date()}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RoleUserTeams', null, {});
  }
};
