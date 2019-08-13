'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reminder = sequelize.define('Reminder', {
    seenTime: DataTypes.DATE,
    content: DataTypes.STRING,
    typecontent: DataTypes.STRING
  }, {});
  Reminder.associate = function(models) {
    Reminder.belongsTo(models.User,{as:'sender',foreignKey:'senderUserId',targetKey:'id'});
    Reminder.belongsTo(models.User,{as:'receiver',foreignKey: 'receivedUserId', targetKey:  'id'});
  };
  return Reminder;
};