const express = require('express');
const {body} = require('express-validator/check');
const router = express.Router();
const User = require('../../models/user');
const userController = require('../../Controller/users');
const teamController = require('../../Controller/team');
const isauth=require('../../middlware/is-auth');
const upload=require('../../middlware/upload-image');

router.post('/create',isauth,[upload.single('image'),body('name').trim().not().isEmpty()],teamController.create);
router.post('/addMember',[body('idrole').isNumeric(),body('iduser').isNumeric(),body('idteam').isNumeric()],isauth,teamController.addMember);
router.post('/removeMember',[body('iduser').isNumeric(),body('idteam').isNumeric()],isauth,teamController.removeMember);

module.exports= router;