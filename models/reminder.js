const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const Reminder = sequelize.define('reminder', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    seenTime: {
        type: Sequelize.DATE,
        allowNull: true
    },
    content: {
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    typecontent:{
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    senderUserId:{
     type:Sequelize.INTEGER,
     allowNull:false
    },
    receivedUserId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});

Reminder.belongsTo(User,{as:'sender',foreignKey:'senderUserId',targetKey:'id'});
Reminder.belongsTo(User,{as:'receiver',foreignKey: 'receivedUserId', targetKey:  'id'});


module.exports = Reminder;

