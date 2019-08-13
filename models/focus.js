'use strict';
module.exports = (sequelize, DataTypes) => {
  const Focus = sequelize.define('Focus', {
    state: DataTypes.STRING
  }, {});
  Focus.associate = function(models) {
   Focus.belongsTo(models.User,{foreignKey:'userId',targetKey:'id'})
  };
  return Focus;
};