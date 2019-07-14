const Sequelize = require('sequelize');
const sequelize = new Sequelize('focus2', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
    logging:false
});

module.exports = sequelize;