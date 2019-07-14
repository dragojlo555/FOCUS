const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Team=require('./team');
const User=require('./user');

const TeamReminderSeen=sequelize.define('teamreminderseen',{

    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    lastseen:{
      type:Sequelize.DATE,
      allowNull:true
    },
    userid:{
        type:Sequelize.INTEGER,
        allowNull: false
    },
    teamid:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});


TeamReminderSeen.belongsTo(User,{foreignKey:'userid',targetKey:'id'});
TeamReminderSeen.belongsTo(Team,{foreignKey:'teamid',targetKey:'id'});

module.exports=TeamReminderSeen;



