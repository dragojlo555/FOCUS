const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Team = require('./team');

const TeamReminder = sequelize.define('teamreminder', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type:Sequelize.STRING,
        allowNull:false
    },
    typecontent:{
        type:Sequelize.STRING,
        allowNull: false
    },
    seentime:{
        type:Sequelize.DATE,
        allowNull:true
    },
    userid:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    teamid:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});

TeamReminder.belongsTo(User,{foreignKey:'userid',targetKey:'id'});
TeamReminder.belongsTo(Team,{foreignKey: 'teamid', targetKey:  'id'});

module.exports = TeamReminder;

