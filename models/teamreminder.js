'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeamReminder = sequelize.define('TeamReminder', {
    content: DataTypes.STRING,
    typecontent: DataTypes.STRING,
    seentime: DataTypes.DATE
  }, {});
  TeamReminder.associate = function(models) {
    TeamReminder.belongsTo(models.User,{foreignKey:'userid',targetKey:'id',as:'user'});
    TeamReminder.belongsTo(models.Team,{foreignKey: 'teamid', targetKey:  'id'});
  };
  return TeamReminder;
};