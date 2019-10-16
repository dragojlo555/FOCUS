const express = require('express');
const {body, query} = require('express-validator/check');
const router = express.Router();
const chatController = require('../../Controller/chat');
const isauth = require('../../middleware/is-auth');
const teamRole=require('../../middleware/team-role');



router.get('/user', isauth, [query('senderid').isNumeric(), query('receivedid').isNumeric()], chatController.getMessagesByUser);
router.get('/user/load', isauth, [query('senderid').isNumeric(), query('lastid').isNumeric()], chatController.loadMoreMessagesUser);
router.get('/team/load', isauth,teamRole, [query('teamid').isNumeric(), query('lastid').isNumeric()], chatController.loadMoreMessagesTeam);
router.get('/team', isauth,teamRole,[query('teamid').isNumeric()], chatController.getMessageByTeam);
router.get('/user/seen', query('senderid').isNumeric(), isauth, chatController.getUnreadMessageByUser);
router.post('/user/seen', isauth, body('senderid').isNumeric(), chatController.setSeenOnMessagesUser);
router.post('/team/seen', isauth,teamRole, body('teamid').isNumeric(), chatController.setTimeLastSeenMessage);
router.get('/team/seen', isauth,teamRole,query('teamid').isNumeric(), chatController.getTeamUnreadCount);
router.get('/image', isauth,[query('id').isNumeric(),query('chatType').trim().not().isEmpty(),query('type').trim().not().isEmpty()] ,chatController.loadPreviousImage);


module.exports = router;