const Sequelize = require('sequelize');
const sequelize = new Sequelize('focus_dev', 'root', '1kosarka1', {
    dialect: 'mysql',
    host: 'localhost',
    logging:false
});

module.exports = sequelize;