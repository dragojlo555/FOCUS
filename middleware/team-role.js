const User=require('../models').User;
const Team=require('../models').Team;
const Role=require('../models').Role;
const RoleUserTeam=require('../models').RoleUserTeam;
const UserTeam=require('../models').UserTeam;

module.exports = async (req, res, next) => {
    try {
        let teamid = req.query.teamid;
        if (teamid === undefined)teamid=req.body.teamid;
        const userTeam = await UserTeam.findOne({
            where: {userId: req.userId, deletedAt: null, teamId: teamid}
        });
        if(!userTeam){
            return res.status(401).json({msg: 'Authorization failed'});
        }
            } catch (err) {
        return res.status(401).json({msg: 'Authorization failed'});
    }
    next();
};