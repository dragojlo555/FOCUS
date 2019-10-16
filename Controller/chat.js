const Sequelize = require('sequelize');
const User = require('../models').User;
const TeamReminder = require('../models').TeamReminder;
const UserReminder = require('../models').Reminder;
const TeamReminderSeen = require('../models').TeamReminderSeen;
const socketIO = require('../util/socket');
const globalVar = require('../server');


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
            raw: true,
            limit: 12,
            order: [['id', 'desc']],
            where: {
                [op.or]: [{senderUserId: sendId, receivedUserId: recId}, {
                    receivedUserId: sendId,
                    senderUserId: recId
                }]
            }
        });
        return res.status(200).json({msg: 'Success', message: message});
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
        const sendId = req.query.teamid;
        let message = await TeamReminder.findAll({
            limit: 12, order: [['id', 'desc']],
            where: {
                teamid: sendId
            }, include: [{model: User, as: 'user', attributes: ['firstName', 'lastName', 'avatar']}]
        });
        return res.status(200).json({msg: 'Success', message: message});
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.setSeenOnMessagesUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        console.log('Set Seen');
        const chatUser = req.body.senderid;
        const user = await UserReminder.update({seenTime: Date.now()}, {
            where: {
                receivedUserId: req.userId,
                senderUserId: chatUser
            }
        });
        socketIO.getIO().to(globalVar.socketClients[chatUser]).emit('user-seen-' + chatUser, {idViewer: +req.userId});
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
        TeamReminder.update({seentime: Date.now()}, {where: {teamId: teamId}});
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
        return res.status(200).json({message: 'Success', update: temp})
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.getTeamUnreadCount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const userId = req.userId;
        const teamId = req.query.teamid;
        let lastSeen = await TeamReminderSeen.findOne({
            where: {
                teamid: teamId,
                userid: userId
            }
        });
        let message = null;
        if (lastSeen) {
            message = await TeamReminder.findAll({
                where: {
                    createdAt: {[op.gt]: lastSeen.lastseen},
                    teamid: teamId
                }, include: [{model: User, as: 'user'}]
            });
        } else {
            message = await TeamReminder.findAll({
                where: {
                    teamid: teamId
                }, include: [{model: User, as: 'user'}]
            });
        }
        return res.status(200).json({msg: 'Success', number: message.length, teamid: teamId});
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.loadMoreMessagesUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const userIdReq = req.query.senderid;
        const lastIdReq = req.query.lastid;

        let message = await UserReminder.findAll({
            limit: 12,
            order: [['id', 'desc']],
            where: {
                [op.or]: [{senderUserId: userIdReq, receivedUserId: req.userId}, {
                    receivedUserId: userIdReq,
                    senderUserId: req.userId
                }],
                id: {[op.lt]: lastIdReq}
            }
        });
        return res.status(200).json({msg: 'message', messages: message});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

exports.loadMoreMessagesTeam = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const sendId = req.query.teamid;
        const lastIdReq = req.query.lastid;
        let message = await TeamReminder.findAll({
            limit: 12, order: [['id', 'desc']],
            where: {
                teamid: sendId,
                id: {[op.lt]: lastIdReq}
            }, include: [{model: User, as: 'user', attributes: ['firstName', 'lastName', 'avatar']}]
        });
        return res.status(200).json({msg: 'Success', messages: message});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

exports.loadPreviousImage = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const chatType = req.query.chatType;
        const id = req.query.id;
        const type = req.query.type;
        const messageKey = req.query.messageKey;
        let message = null;

        if (chatType === 'team' && type === 'previous') {
            message = await TeamReminder.findOne({
                limit: 1, order: [['id', 'desc']],
                where: {
                    teamid: id,
                    typecontent: 'image',
                    id: {[op.lt]: messageKey}
                }, include: [{
                    model: User, as: 'user', attributes:
                        ['firstName', 'lastName', 'avatar']
                }]
            });
        } else if (chatType === 'team' && type === 'next') {
            message = await TeamReminder.findOne({
                limit: 1, order: [['id', 'asc']],
                attributes: {
                    include: [],
                    exclude: ['teamid', 'userid']
                },
                where: {
                    teamid: id,
                    typecontent: 'image',
                    id: {[op.gt]: messageKey}
                }, include: [{
                    model: User, as: 'user', attributes:
                        ['firstName', 'lastName', 'avatar']
                }]
            });
        } else if (chatType === 'user' && type === 'previous') {
            message = await UserReminder.findOne({
                limit: 1,
                order: [['id', 'desc']],
                where: {
                    typecontent: 'image',
                    [op.or]: [{senderUserId: id, receivedUserId: req.userId}, {
                        receivedUserId: id,
                        senderUserId: req.userId
                    }],
                    id: {[op.lt]: messageKey}
                }
            });
        }else if (chatType === 'user' && type === 'next') {
            message = await UserReminder.findOne({
                limit: 1,
                order: [['id', 'asc']],
                where: {
                    typecontent: 'image',
                    [op.or]: [{senderUserId: id, receivedUserId: req.userId}, {
                        receivedUserId: id,
                        senderUserId: req.userId
                    }],
                    id: {[op.gt]: messageKey}
                }
            });
        }
        return res.status(200).json({msg: 'Success', message: message});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};
