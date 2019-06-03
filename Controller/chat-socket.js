const UserReminder=require('../models/reminder');
const TeamReminder=require('../models/teamReminder');


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
    const receiver=payload.receiverId;
    const sender=payload.senderUserId;
    const data=payload.data;

    let teamRem=await TeamReminder.create({
       userid:sender,
        typecontent:data.type,
        content:data.content,
        teamid:receiver
    });

    return teamRem;
};