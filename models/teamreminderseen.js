'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeamReminderSeen = sequelize.define('TeamReminderSeen', {
    lastseen: DataTypes.DATE
  }, {});
  TeamReminderSeen.associate = function(models) {
    TeamReminderSeen.belongsTo(models.User,{foreignKey:'userid',targetKey:'id'});
    TeamReminderSeen.belongsTo(models.Team,{foreignKey:'teamid',targetKey:'id'});
  };
  return TeamReminderSeen;
};