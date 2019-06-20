const UserReminder=require('../models/reminder');
const TeamReminder=require('../models/teamReminder');
const Sequelize = require('sequelize');
const User=require('../models/user');
const op = Sequelize.Op;

exports.getMessagesByUser=async(req,res)=>{
    try {
        const recId = req.body.receivedid;
        const sendId = req.body.senderid;
        let message = await UserReminder.findAll({limit:12,
            order: [['id', 'desc']],
            where: {
                [op.or]: [{senderUserId: sendId, receivedUserId: recId}, {
                    receivedUserId: sendId,
                    senderUserId: recId
                }]
            }
        });
        return res.status(200).json(message);
    }catch (err) {
        return res.status(500).json(err);
    }
};

exports.getMessageByTeam=async(req,res)=>{
    try {
        const sendId = req.body.senderid;
        let message=await  TeamReminder.findAll({limit:12,order:[['id','desc']],
        where:{
            teamid:sendId
        },include:[{model:User}]
        });
        return res.status(200).json(message);
    }catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

exports.setSeenOnMessagessUser=async(req,res)=>{
    try{
        const chatUser=req.body.senderid;
        UserReminder.update({seenTime:Date.now()},{where:{receivedUserId:req.userId,senderUserId:chatUser}});
        return res.status(200).json({msg:'Success'})
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
};

exports.getUnreadMessageByUser=async(req,res)=>{
    try{
        const chatUser=req.body.senderid;
        let message=await UserReminder.findAll(
            {where:{receivedUserId:req.userId,senderUserId:chatUser,seenTime:null}}
        );
        return res.status(200).json({senderId:chatUser,number:message.length})
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
};
