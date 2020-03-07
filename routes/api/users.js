const express = require('express');
const {body, query} = require('express-validator/check');
const router = express.Router();
const passport=require('passport');
const User = require('../../models').User;
const userController = require('../../Controller/users');
const isauth = require('../../middleware/is-auth');
const upload = require('../../middleware/upload-image');

require('../../middleware/myPassport')(passport);

router.get('/', isauth, userController.allUser);
router.post('/create', [upload.single('image'),
        body('email').isEmail().withMessage('Please enter valid email!!!').custom((value, {req}) => {
            return User.findOne({where: {mail: value}}).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-Mail address already exists!');
                }
            });
        }).normalizeEmail(),
        body('password').trim().isLength(6), body('firstname').trim().not().isEmpty(),
        body('lastname').trim().not().isEmpty(), body('phone').trim().not().isEmpty()],
    userController.createUser);
router.post('/login', [
        body('email').isEmail().withMessage('Please enter valid email!!!'),
        body('password').trim().isLength(6)],
    userController.loginUser);
router.post('/focus', isauth, userController.changeMyState);
router.post('/changeprofileavatar', isauth, [upload.single('image'), body('phone').trim().not().isEmpty(), body('firstname').trim().not().isEmpty(), body('lastname').trim().not().isEmpty(),
], userController.changeProfileFull);
router.post('/changeprofile', isauth, [body('firstname').trim().not().isEmpty(), body('phone').trim().not().isEmpty(), body('lastname').trim().not().isEmpty(),
], userController.changeProfile);
router.get('/logout', isauth, userController.logoutUser);
router.get('/verification', [query('token'), query('mail')], userController.verification);
router.get('/resendverification', [query('mail')], userController.resendMailVerification);
router.get('/mailexist', [query('mail')], userController.checkExistMail);
router.get('/changepassword', [query('mail')], userController.resetPassword);
router.post('/confirmresetpassword', [query('code'), query('password'), query('mail')], userController.confirmResetPassword);
router.get('/info', isauth,userController.info);
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']},null));
router.get('/auth/google/callback', passport.authenticate('google',{},null),userController.authGoogleCallback);
router.get('/hello', (req, res) => {
    return res.status(200).json({ok: req})
},);
module.exports = router;