const User=require('../models').User;
const TeamReminder=require('../models').TeamReminder;
const UserReminder=require('../models').Reminder;
const fs=require('fs');
const socketIO = require('../util/socket');
const UserTeam=require('../models').UserTeam;
const globalVar = require('../server');


function createImage(data){
    let base64Image =data.content.split(';base64,').pop();
    data.content='public/images/chat/'+(+new Date())+Math.floor(Math.random() * 100000)+'.png';
    fs.writeFile('./'+data.content, base64Image, {encoding: 'base64'}, function(err) {
    });
}


function createFiles(data){
    let listFile=data.content.split('$$');
    data.content='';
    console.log(listFile.length,'--');
    listFile.forEach(file=>{
        let base64File=file.split(';base64,').pop();
        let nameFile='public/files/chat/'+(+new Date())+Math.floor(Math.random() * 100000)+file.split(';')[0];
        fs.writeFile('./'+nameFile, base64File, {encoding: 'base64'}, function(err) {
        });
        nameFile=nameFile+';'+file.split(';')[0];
        data.content=data.content+'$$'+nameFile;
    });
}

exports.receiveUserMessage= async (payload)=>{
  const receiver=payload.receiverId;
  const sender=payload.senderUserId;
  const data=payload.data;

    if(data.type==='image'){
        createImage(data);
    }

    if(data.type==='file'){
        createFiles(data);
    }

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

    if(data.type==='image'){
     createImage(data);
    }

    if(data.type==='file'){
        createFiles(data);
    }

    let teamRem=await TeamReminder.create({
        userid:sender,
        typecontent:data.type,
        content:data.content,
        teamid:receiver
    });
   let newMess=await TeamReminder.findOne({where:{id:teamRem.id},include:[{model:User,as:'user'}]});
    return newMess;
};

exports.addUserInRooms=async (userId,socket)=>{
    const teams=await UserTeam.findAll({raw:true,where:{userId:userId,deletedAt:null},attributes:["teamId","teamId"]});
    teams.forEach(item=>{
        socket.join('team-'+item.teamId);
    })
};

exports.setSeenUser=async(userId,senderId)=>{
    try {
        const user =await UserReminder.update({seenTime: Date.now()}, {
            where: {
                receivedUserId: userId,
                senderUserId: senderId
            }
        });
        socketIO.getIO().to(globalVar.socketClients[senderId]).emit('user-seen-' + senderId, {idViewer: +userId});
    } catch (err) {
        console.log(err);
    }
};
