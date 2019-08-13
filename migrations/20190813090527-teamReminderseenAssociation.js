'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'TeamReminderSeens',
        'userid',
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
          'TeamReminderSeens',
          'teamid',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Teams', // name of Source model
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'TeamReminderSeens',
        'userid'
    ).then(()=>{
      return queryInterface.removeColumn(
          'TeamReminderSeens',
          'teamid'
      )
    })
  }
};
