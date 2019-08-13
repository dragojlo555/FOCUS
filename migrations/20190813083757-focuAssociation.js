'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Focus',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'Focus',
        'userId'
    );
  }
};
