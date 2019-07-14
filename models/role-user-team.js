const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Role=require('./role');
const UserTeam=require('./user-team');

const RoleUserTeam = sequelize.define('roleUserTeam', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userTeamId: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    deletedAt: {
        type:Sequelize.DATE,
        allowNull:true
    }
});

RoleUserTeam.belongsTo(Role,{foreignKey:'roleId',targetKey:'id'});
RoleUserTeam.belongsTo(UserTeam,{foreignKey:'userTeamId',targetKey:'id'});
UserTeam.hasMany(RoleUserTeam,{foreignKey:'userTeamId',targetKey:'id'});
//UserTeam.hasMany(RoleUserTeam);

module.exports = RoleUserTeam;