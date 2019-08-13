'use strict';
module.exports = (sequelize, DataTypes) => {
  const RoleUserTeam = sequelize.define('RoleUserTeam', {
    active: DataTypes.BOOLEAN,
    deletedAt:DataTypes.DATE
  }, {});
  RoleUserTeam.associate = function(models) {
    RoleUserTeam.belongsTo(models.Role,{foreignKey:'roleId',targetKey:'id',as:'role'});
    RoleUserTeam.belongsTo(models.UserTeam,{foreignKey:'userTeamId',targetKey:'id'});
  };
  return RoleUserTeam;
};