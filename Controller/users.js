const User = require('../models/user');
const Reminder = require('../models/reminder');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getDefault = (req, res) => {
    res.json({msg: 'Users Works'});
};

exports.createUser = (req, res) => {
    const pass = req.body.password;
    const emailReq = req.body.email;
    const firstNameReq = req.body.firstname;
    const lastNameReq = req.body.lastname;
    const avatarReq= req.file.path;

    const errors = validationResult(req);
    // check middleware validation
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    bcrypt.hash(pass, 10).then(hashPas => {
            return User.create({
                lastName: lastNameReq,
                password: hashPas,
                mail: emailReq,
                firstName: firstNameReq,
                Avatar:avatarReq
            }).then(result => {
                return res.status(201).json({message: 'User created !!!', userId: result});
            }).catch(err => {
                    return res.status(500).json({msg: 'Internal server error !!!'});
                }
            )
        }
    );
};

exports.loginUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({err:errors.array(),mail:req.body});
    }
    const email = req.body.email;
    const pass = req.body.password;
    let errorMsg = null;
    let loadedUser = null;
    User.findOne({where: {mail: email}}).then(data => {
            if (!data) {
                return Promise.resolve(null);
            }
            return Promise.resolve(data);
        }
    ).then(result => {
            if (!result) {
                errorMsg = 'A user with this email could not be found.';
                return Promise.resolve(null);
            } else {
                loadedUser = result.dataValues;
                return bcrypt.compare(pass, loadedUser.password);
            }
        }
    ).then(result => {
            if (result) {
                const token = jwt.sign(
                    {
                        email: loadedUser.mail,
                        userId: loadedUser.id.toString()
                    },
                    'secret',
                    {expiresIn: '1h'}
                );
                return res.status(200).json({token: token, userId: loadedUser.id.toString()});
            }
            if (!errorMsg) errorMsg = 'Wrong password !!!';
            return res.status(401).json({msg: errorMsg});
        }
    )
};

exports.info = (req, res) => {
    return res.status(200).json({id: req.userId});
};

exports.changeProfile = (req, res) => {
    const firstNameReq = req.body.firstname;
    const lastNameReq = req.body.lastname;
    const avatarReq= req.file.path;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    console.log(req.userId, firstNameReq, lastNameReq,avatarReq);
    User.update({firstName: firstNameReq, lastName: lastNameReq,Avatar:avatarReq}, {where: {id: req.userId}}).then(result => {
            return res.status(200).json({msg: 'Success', updated: result});
        }
    ).catch(err => {
            return res.status(404).json({msg: 'Failed', error: err});
        }
    );
};

