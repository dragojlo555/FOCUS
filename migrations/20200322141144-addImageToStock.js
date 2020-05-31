'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn('Stocks',
       'Image',{
          allowNull:false,
          defaultValue:'-',
          type:Sequelize.STRING
       })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Stocks',
          'Image'
      )
  }
};
