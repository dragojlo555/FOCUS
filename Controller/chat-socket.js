const UserReminder=require('../models/reminder');
const TeamReminder=require('../models/teamReminder');
const User=require('../models/user');

exports.receiveUserMessage= async (payload)=>{
  const receiver=payload.receiverId;
  const sender=payload.senderUserId;
  const data=payload.data;

     let message= await  UserReminder.create({
         senderUserId: sender,
         receivedUserId: receiver,
         typecontent: data.type,
         content: data.content
     });
        return message;
};


exports.receiveTeamMessage=async (payload)=>{
    console.log(payload);
    const receiver=payload.receiverId;
    const sender=payload.senderUserId;
    const data=payload.data;

    let teamRem=await TeamReminder.create({
        userid:sender,
        typecontent:data.type,
        content:data.content,
        teamid:receiver
    });
    let newMess=await TeamReminder.findOne({where:{id:teamRem.id},include:[{model:User}]});

    return newMess;
};