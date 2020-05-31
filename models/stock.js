'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    Cryptocurrencie: DataTypes.STRING,
    Price:DataTypes.DOUBLE,
    Volume:DataTypes.INTEGER,
    Circulating:DataTypes.INTEGER,
    Image:DataTypes.STRING
  }, {});
  Stock.associate = function(models) {
    // associations can be defined here
  };
  return Stock;
};