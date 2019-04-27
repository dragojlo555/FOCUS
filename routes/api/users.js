const express = require('express');
const {body} = require('express-validator/check');
const router = express.Router();
const User = require('../../models/user');
const userController = require('../../Controller/users');
const isauth=require('../../middlware/is-auth');
// @route   GET api/users/test
const multer = require('multer');
const upload=require('../../middlware/upload-image');
const {validationResult} = require('express-validator/check');


// @desc    Tests users route
// @access  Public
router.get('/',isauth,userController.allUser);

router.post('/create', [upload.single('image'),
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

router.get('/info',isauth,userController.info);


router.post('/changeProfile', isauth,[upload.single('image'),body('firstname').trim().not().isEmpty(),body('lastname').trim().not().isEmpty(),
    body('email').isEmail().withMessage('Please enter valid email!!!')],userController.changeProfile);


module.exports = router;