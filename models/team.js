const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Team=sequelize.define('team',{
   id:{
       type:Sequelize.INTEGER,
       primaryKey:true,
       autoIncrement: true
   },
    name:{
       type:Sequelize.STRING,
        allowNull: false
    },
    endedAt:{
       type:Sequelize.DATE,
        allowNull: true
    },
    avatar:{
       type:Sequelize.STRING,
        allowNull: true
    },
    creatorUserId:{
       type:Sequelize.INTEGER,
        allowNull:false
    }
});


module.exports = Team;