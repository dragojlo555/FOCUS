'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    code: DataTypes.STRING
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};