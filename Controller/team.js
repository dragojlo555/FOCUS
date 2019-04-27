const User = require('../models/user');
const Team = require('../models/team');
const RoleUserTeam = require('../models/role-user-team');
const Role = require('../models/role');
const UserTeam = require('../models/user-team');
const {validationResult} = require('express-validator/check');


exports.allUsers=(req,res)=>{
    const idTeamReq=req.body.idteam;
    UserTeam.findAll({where:{teamId:idTeamReq,deletedAt:null},include:[{model:User}]}).then(data=>
        res.status(200).json({msg:'Success',users:data})
    ).catch(err=>{
        res.status(400).json({msg:'Failed',error:err});
    })
};


exports.create = (req, res) => {
    let idTeam = null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    const teamNameReq = req.body.name;
    const avatarReq = req.file.path;

    console.log('Create team');
    Team.create({
        creatorUserId: req.userId,
        name: teamNameReq,
        avatar: avatarReq
    }).then(team => {
            idTeam = team.id;
            return UserTeam.create({
                userId: req.userId,
                teamId: team.id
            });
        }
    ).then(userTeam => {
        return RoleUserTeam.create({
            userTeamId: userTeam.id,
            roleId: 1
        });
    }).then(roleUserTeam => {
        return res.status(201).json({msg: 'Team created !!!', team: {id: idTeam, name: teamNameReq}})
    }).catch(err => {
        return res.status(500).json({msg: 'Failed !!!', error: err});
    });
};


exports.addMember = (req, res) => {
    const idRoleReq = req.body.idrole;
    const idUserReq = req.body.iduser;
    const idTeamReq = req.body.idteam;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    UserTeam.findOne({where: {userId: req.userId, teamId: idTeamReq}}).then(result => {
        if (!result) {
            const error = new Error('A user with this id could not be found.');
            error.statusCode = 401;
            throw error;
        }
        return RoleUserTeam.findOne({where: {userTeamid: result.id, roleId: 1}});
    }).then(result => {
        if (!result) {
            const error = new Error('A user without roles .');
            error.statusCode = 401;
            throw error;
        }
        return UserTeam.create({
            userId: idUserReq,
            teamId: idTeamReq
        });
    }).then(userTeam => {
            return RoleUserTeam.create({
                userTeamId: userTeam.id,
                roleId: idRoleReq
            });
        }
    ).then(roleUserTeam => {
        return res.status(200).json({msg: 'Success', userTeam: {userTeamId: roleUserTeam.userTeamId}});
    }).catch(err => {
        if(!err.statusCode){err.statusCode=500}
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    });
};


exports.getAllTeamByUser=async (req,res)=>{
    const userReq=req.userId;
    try{
        const teams=await UserTeam.findAll({where:{userId:userReq,deletedAt:null},include:[{model:Team,required:true,where:{}}]});
        res.status(200).json({msg:'Success',data:teams});
    }catch(err){
        if(!err.statusCode)err.statusCode=500;
        return res.status(err.statusCode).json({msg:'Failed',error:err});
    }
};




exports.removeMember = (req, res) => {
    const idUserReq = req.body.iduser;
    const idTeamReq = req.body.idteam;
    console.log(req.userId, idTeamReq);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    UserTeam.findOne({where: {userId: req.userId, teamId: idTeamReq}}).then(result => {
        if (!result) {
            const error = new Error('A user with this id could not be found.');
            error.statusCode = 401;
            throw error;
        }
        return RoleUserTeam.findOne({where: {userTeamid: result.id, roleId: 1}});
    }).then(result => {
            if (!result) {
                const error = new Error('A user without roles.');
                error.statusCode = 401;
                throw error
            } else {
                return UserTeam.update({deletedAt: Date.now()}, {where: {userId: idUserReq, teamId: idTeamReq}}); //
            }
        }
    ).then(result => {
        return res.status(200).json({msg: 'Success', updated: result});
    }).catch(err => {
            if(!err.statusCode){err.statusCode=500}
            return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
        }
    );
};

exports.addRole=async (req,res)=>{
    const idTeamUserReq=req.body.idteamuser;
    const idRoleReq=req.body.idrole;
    try{
        let temp=await RoleUserTeam.findOne({where:{userTeamId:idTeamUserReq,deletedAt:null},include:[{model:Role,where:{id:idRoleReq}}]});
        if(temp){
            const error = new Error('The user already has that role!!!');
            error.statusCode = 401;
            throw error;
        }else{
            let userteamrole=await RoleUserTeam.create({userTeamId:idTeamUserReq,roleId:idRoleReq});
            res.status(200).json({msg:'Success',data:userteamrole});
        }

    }catch(err){
        if(!err.statusCode)err.statusCode=501;
        return res.status(err.statusCode).json({msg:'Failed',error:err.message});
    }
};

exports.removeRole=async (req,res)=>{
    const idTeamUserReq=req.body.idteamuser;
    const idRoleReq=req.body.idrole;
    try{
     let update=await RoleUserTeam.update({deletedAt:Date.now()},{where:{userTeamId:idTeamUserReq,roleId:idRoleReq}});
     res.status(200).json({msg:'Success',data:update});
    }catch(err){
        if(!err.statusCode)err.statusCode=500;
        return res.status(err.statusCode).json({msg:'Failed',error:err});
    }

};

exports.leaveTeam=(req,res)=>{
const idTeamReq=req.body.idteam;
};

