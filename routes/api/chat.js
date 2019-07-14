const express = require('express');
const {body} = require('express-validator/check');
const router = express.Router();
const User = require('../../models/user');
const chatController = require('../../Controller/chat');
const isauth=require('../../middleware/is-auth');


router.get('/user',isauth,[query('senderid').isNumeric(),query('receivedid').isNumeric()],chatController.getMessagesByUser);
router.get('/team',isauth,[query('senderid').isNumeric()],chatController.getMessageByTeam);
router.post('/user/unread',isauth,chatController.getUnreadMessageByUser);
router.post('/user/seen',isauth,chatController.setSeenOnMessagesUser);
router.post('/team/seen',isauth,chatController.setTimeLastSeenMessage);
router.get('/team/seen',isauth,chatController.getTeamUnreadCount);


module.exports=router;