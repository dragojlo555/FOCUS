'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Users',
        'auth_key',{
          allowNull:true,
          type:Sequelize.STRING
        }
    );

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Users',
          'auth_key'
      )
  }
};
