const Sequelize = require('sequelize');
const sequelize = new Sequelize('node', 'nodeuser', 'nodeuser', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;