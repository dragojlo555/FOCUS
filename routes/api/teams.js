const express = require('express');
const {body} = require('express-validator/check');
const router = express.Router();
const User = require('../../models/user');
const userController = require('../../Controller/users');
const teamController = require('../../Controller/team');
const isauth=require('../../middlware/is-auth');


router.post('/create',[body('name').trim().not().isEmpty()],isauth,teamController.create);
router.post('/addMember',[body('idrole').isNumeric(),body('iduser').isNumeric(),body('idteam').isNumeric()],isauth,teamController.addMember);
router.post('/removeMember',[body('iduser').isNumeric(),body('idteam').isNumeric()],isauth,teamController.removeMember);

module.exports= router;