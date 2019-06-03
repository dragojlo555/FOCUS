const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User=require('../models/user');
const Team=require('../models/team');

const UserTeam = sequelize.define('userTeam', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deletedAt:{
        type:Sequelize.DATE,
        allowNull: true
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    teamId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});
UserTeam.belongsTo(User,{foreignKey:'userId',targetKey: 'id'});
UserTeam.belongsTo(Team,{foreignKey:'teamId',targetKey:'id'});

module.exports = UserTeam;