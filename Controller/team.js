const User = require('../models/user');
const Team = require('../models/team');
const RoleUserTeam = require('../models/role-user-team');
const Role = require('../models/role');
const UserTeam = require('../models/user-team');
const {validationResult} = require('express-validator/check');


exports.create = (req, res) => {
    let idTeam = null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    const teamNameReq = req.body.name;
    const avatarReq = req.body.name;
    console.log('Create team');
    Team.create({
        creatorUserId: req.userId,
        name: teamNameReq
    }).then(team => {//Moze se primjeniti i kod update-a iako vraca vise podataka
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
        })
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
    UserTeam.findOne({where:{userId: req.userId,teamId: idTeamReq}}).then(result=>{
            if(result){
             return   RoleUserTeam.findOne({where:{userTeamid: result.id,idRole: 1}});
            }
          return res.status(405).json({msg:'Failed'});
      }).then(result=>{
          if(!result){
              return res.status(405).json({msg:'Failed'});
          }}
    ).catch(err=> {
         return res.status(405).json({msg:'Failed'});
        }
    );
    UserTeam.create({
        userId: idUserReq,
        teamId: idTeamReq
    }).then(userTeam => {
            return RoleUserTeam.create({
                userTeamId: userTeam.id,
                roleId: idRoleReq
            });
        }
    ).then(roleUserTeam => {
        return res.status(200).json({msg: 'Success', userTeam: {userTeamId: roleUserTeam.userTeamId}});
    }).catch(err => {
        return res.status(500).json({msg: 'Failed', error: err});
    });
};



