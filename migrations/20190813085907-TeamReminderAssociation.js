'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'TeamReminders',
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
          'TeamReminders',
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
          'TeamReminders',
          'userid'
      ).then(()=>{
        return queryInterface.removeColumn(
            'TeamReminders',
            'teamid'
        )
      })
  }
};
