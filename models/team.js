'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: DataTypes.STRING,
    endedAt: DataTypes.DATE,
    avatar: DataTypes.STRING
  }, {});
  Team.associate = function(models) {
    Team.belongsTo(models.User,{foreignKey:'creatorUserId',targetKey:'id',as:'user'});
  };
  return Team;
};