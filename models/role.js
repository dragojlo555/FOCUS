const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Role=sequelize.define('role',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code:{
        type:Sequelize.STRING,
        unique: true,
        allowNull: false
    }
});

module.exports=Role;