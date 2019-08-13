'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'UserTeams',
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
    ).then(()=>{
      return queryInterface.addColumn(
          'UserTeams',
          'teamId',
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
        'UserTeams',
        'userId'
    ).then(()=>{
      return queryInterface.removeColumn(
          'UserTeams',
          'teamId'
      )
    })
  }
};
