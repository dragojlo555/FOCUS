'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'RoleUserTeams',
        'userTeamId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'UserTeams', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
    ).then(()=>{
      return queryInterface.addColumn(
          'RoleUserTeams',
          'roleId',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Roles', // name of Source model
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
        'RoleUserTeams',
        'userTeamId'
    ).then(() => {
      return queryInterface.removeColumn(
          'RoleUserTeams',
          'roleId'
      )
    })
  }
};
