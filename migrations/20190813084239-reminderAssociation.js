'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Reminders',
        'senderUserId',
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
    ).then(()=>{
      return queryInterface.addColumn(
          'Reminders',
          'receivedUserId',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Users', // name of Source model
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'Reminders',
        'senderUserId'
    ).then(() => {
      return queryInterface.removeColumn(
          'Reminders',
          'receivedUserId'
      )
    })
  }
};
