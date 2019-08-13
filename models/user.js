'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    mail: DataTypes.STRING,
    avatar: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasOne(models.Focus,{foreignKey:'userId',targetKey:'id',as:'focu'});
  };
  return User;
};