const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const Reminder = sequelize.define('reminder', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sendTime: {
        type: Sequelize.DATE,
        allowNull: false
    },
    seenTime: {
        type: Sequelize.DATE,
        allowNull: true
    },
    text: {
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

Reminder.belongsTo(User,{foreignKey:'senderUserId',targetKey:'id'});
Reminder.belongsTo(User,{foreignKey: 'receivedUserId', targetKey:  'id'});


module.exports = Reminder;

