const express = require('express');
const {body} = require('express-validator/check');
const router = express.Router();
const User = require('../../models/user');
const userController = require('../../Controller/users');
const isauth=require('../../middlware/is-auth');
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', userController.getDefault);

router.put('/create', [
    body('email').isEmail().withMessage('Please enter valid email!!!').custom((value, {req}) => {
        return User.findOne({where: {mail: value}}).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-Mail address already exists!');
            }
        });
    }).normalizeEmail(),
    body('password').trim().isLength(6), body('firstname').trim().not().isEmpty(),
    body('lastname').trim().not().isEmpty()],
    userController.createUser);

router.post('/login', [
        body('email').isEmail().withMessage('Please enter valid email!!!'),
        body('password').trim().isLength(6)],
    userController.loginUser);

router.post('/info',isauth,userController.info);

router.post('/changeProfile', [body('firstname').trim().not().isEmpty(),body('lastname').trim().not().isEmpty(),
    body('email').isEmail().withMessage('Please enter valid email!!!')],isauth,userController.changeProfile);



module.exports = router;