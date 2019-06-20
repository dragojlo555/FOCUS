const express = require('express');
const {body} = require('express-validator/check');
const router = express.Router();
const User = require('../../models/user');
const chatController = require('../../Controller/chat');
const isauth=require('../../middleware/is-auth');


router.post('/all',isauth,chatController.getMessagesByUser);
router.post('/allteam',isauth,chatController.getMessageByTeam);
router.post('/user/unread',isauth,chatController.getUnreadMessageByUser);
router.post('/user/seen',isauth,chatController.setSeenOnMessagessUser);


module.exports=router;