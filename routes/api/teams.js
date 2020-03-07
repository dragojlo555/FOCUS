const express = require('express');
const {body} = require('express-validator/check');
const router = express.Router();
const passport=require('passport');
const teamController = require('../../Controller/team');
const isauth=require('../../middleware/is-auth');
const upload=require('../../middleware/upload-image');



router.post('/create',isauth,[upload.single('image'),body('name').trim().not().isEmpty()],teamController.create);
router.post('/user',[body('email').isEmail().withMessage('Please enter valid email!!!'),body('idteam').isNumeric()],isauth,teamController.addMember);
router.delete('/user',[body('iduser').isNumeric(),body('idteam').isNumeric()],isauth,teamController.removeMember);
router.get('/user',[body('idteam').isNumeric()],isauth,teamController.allUsers);
router.post('/',[body('idteam').isNumeric()],isauth,teamController.getTeam);
router.put('/role',isauth,[body('idteamuser').isNumeric(),body('idrole').isNumeric(),body('oldidrole').isNumeric()],teamController.changeRole);
//router.post('/role',isauth,[body('idteamuser').isNumeric(),body('idrole').isNumeric()],teamController.addRole);
//router.delete('/role',isauth,[body('idteamuser').isNumeric(),body('idrole').isNumeric()],teamController.removeRole);
router.get('/myteams',isauth,teamController.getAllTeamByUser);
module.exports= router;