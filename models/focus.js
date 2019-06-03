const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const User=require('./user');

const Focus=sequelize.define('focus',{

    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    state:{
        type:Sequelize.STRING,
        allowNull:false
        },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Focus.belongsTo(User,{foreignKey:'userId',targetKey:'id'});
User.hasOne(Focus);
module.exports=Focus;
