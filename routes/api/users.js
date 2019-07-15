const express = require('express');
const {body} = require('express-validator/check');
const router = express.Router();
const User = require('../../models/user');
const userController = require('../../Controller/users');
const isauth = require('../../middleware/is-auth');
const upload = require('../../middleware/upload-image');


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
        body('lastname').trim().not().isEmpty(),body('phone').trim().not().isEmpty()],
    userController.createUser);


router.post('/login', [
        body('email').isEmail().withMessage('Please enter valid email!!!'),
        body('password').trim().isLength(6)],
    userController.loginUser);
router.get('/info', isauth, userController.info);
router.post('/focus', isauth, userController.changeMyState);
router.post('/changeprofileavatar', isauth, [upload.single('image'),body('phone').trim().not().isEmpty(), body('firstname').trim().not().isEmpty(), body('lastname').trim().not().isEmpty(),
], userController.changeProfileFull);
router.post('/changeprofile', isauth, [body('firstname').trim().not().isEmpty(),body('phone').trim().not().isEmpty(), body('lastname').trim().not().isEmpty(),
], userController.changeProfile);

module.exports = router;