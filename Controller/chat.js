const UserReminder = require('../models/reminder');
const TeamReminder = require('../models/teamReminder');
const Sequelize = require('sequelize');
const User = require('../models/user');
const TeamReminderSeen = require('../models/teamReminderSeen');
const {validationResult} = require('express-validator/check');
const op = Sequelize.Op;

exports.getMessagesByUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const recId = req.query.receivedid;
        const sendId = req.query.senderid;

        let message = await UserReminder.findAll({
            limit: 12,
            order: [['id', 'desc']],
            where: {
                [op.or]: [{senderUserId: sendId, receivedUserId: recId}, {
                    receivedUserId: sendId,
                    senderUserId: recId
                }]
            }
        });
        return res.status(200).json(message);
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.getMessageByTeam = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const sendId = req.query.senderid;
        let message = await TeamReminder.findAll({
            limit: 12, order: [['id', 'desc']],
            where: {
                teamid: sendId
            }, include: [{model: User}]
        });
        return res.status(200).json(message);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

exports.setSeenOnMessagesUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const chatUser = req.body.senderid;
        UserReminder.update({seenTime: Date.now()}, {where: {receivedUserId: req.userId, senderUserId: chatUser}});
        return res.status(200).json({msg: 'Success', senderid: chatUser})
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

exports.getUnreadMessageByUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const chatUser = req.query.senderid;
        let message = await UserReminder.findAll(
            {where: {receivedUserId: req.userId, senderUserId: chatUser, seenTime: null}}
        );
        return res.status(200).json({senderId: chatUser, number: message.length})
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

exports.setTimeLastSeenMessage = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const userId = req.userId;
        const teamId = req.body.teamid;
       TeamReminder.update({seentime: Date.now()}, {where: {teamId:teamId}});
        let temp = await TeamReminderSeen.findOne({where: {userid: userId, teamid: teamId}});
        if (temp) {
            temp = await TeamReminderSeen.update(
                {
                    lastseen: new Date()
                },
                {
                    where: {
                        userid: userId, teamid: teamId
                    }
                }
            )
        } else {
            temp = await TeamReminderSeen.create({
                userid: userId,
                teamid: teamId,
                lastseen: new Date()
            });
        }
        return res.status(200).json({message:'Success',update:temp})
    } catch (err) {
        return res.status(500).json(err);
    }
};


exports.getTeamUnreadCount=async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    try {
        const userId = req.userId;
        const teamId = req.query.teamid;
        let lastSeen=await TeamReminderSeen.findOne({
            where:{
                    teamid:teamId,
                    userid:userId
            }
        });
        let message=null;
            if(lastSeen.lastseen){
                message = await TeamReminder.findAll({
                    where: {
                        createdAt:{[op.gt]:lastSeen.lastseen},
                        teamid: teamId
                    }, include: [{model: User}]
                });
            }else{
                message = await TeamReminder.findAll({
                    where: {
                        teamid: teamId
                    }, include: [{model: User}]
                });
            }
        return res.status(200).json({msg:'Success',number:message.length,teamid:teamId});
    }catch(err){
        return res.status(500).json(err);
    }
};



