'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTeam = sequelize.define('UserTeam', {
    active: DataTypes.BOOLEAN,
    deletedAt:DataTypes.DATE
  }, {});
  UserTeam.associate = function(models) {
    UserTeam.hasMany(models.RoleUserTeam,{foreignKey:'userTeamId',targetKey:'id',as:'roleUserTeams'});
    UserTeam.belongsTo(models.User,{foreignKey:'userId',targetKey: 'id',as:'user'});
    UserTeam.belongsTo(models.Team,{foreignKey:'teamId',targetKey:'id',as:'team'});
  };
  return UserTeam;
};