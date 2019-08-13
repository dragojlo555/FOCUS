'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Teams',
        'creatorUserId',
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
        'Teams',
        'creatorUserId'
    );
  }
};
