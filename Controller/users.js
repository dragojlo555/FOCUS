const User = require('../models').User;
const Focus = require('../models').Focus;
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const socketIO = require('../util/socket');
const nodemailer = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');
const config = require('../config/appconfig');
const sequelize = require('sequelize');
const op = sequelize.Op;

exports.getDefault = (req, res) => {
    res.json({msg: 'User Work'});
};


exports.allUser = (req, res) => {
    try {
        User.findAll().then(data =>
            res.status(200).json({msg: 'Success', users: data})
        ).catch(err => {
            res.status(400).json({msg: 'Failed', error: err})
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({msg: 'Failed'});
    }
};

exports.checkExistMail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({err: errors.array(), mail: req.query});
    }
    const reqMail = req.query.mail;
    try {
        const user = await User.findOne({where: {mail: reqMail}});
        if (user) {
            res.status(200).json({msg: 'Success', user: user, exist: true});
        } else {
            res.status(200).json({msg: 'Failed', exist: false});
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }

};

exports.createUser = async (req, res) => {
    const pass = req.body.password;
    const emailReq = req.body.email;
    const firstNameReq = req.body.firstname;
    const lastNameReq = req.body.lastname;
    let avatarReq = null;

    if (typeof req.file !== 'undefined') {
        avatarReq = req.file.path;
    }

    const phoneReq = req.body.phone;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        let hash = await bcrypt.hash(pass, 10);
        let mailVerify = cryptoRandomString({length: 24, type: 'url-safe'});
        let NewUser = await User.create({
            lastName: lastNameReq,
            password: hash,
            mail: emailReq,
            avatar: avatarReq,
            firstName: firstNameReq,
            phone: phoneReq,
            verifyMail: mailVerify
        });
        if (NewUser) {
            await Focus.create({
                state: 'work',
                userId: NewUser.id
            });
            sendVerifyMail(emailReq, firstNameReq, mailVerify);
        }
        return res.status(200).json({message: 'Success', user: NewUser});
    } catch (err) {
        console.log(err);
        return res.status(500).json({msg: 'Failed'});
    }
};

exports.logoutUser = async (req, res) => {
    try {
        await User.update({
            auth_key: null,
            UpdatedAt: new Date()
        }, {where: {id: req.userId}});

        return res.status(200).json({msg: 'Success'})
    } catch (err) {
        return res.status(500).json({msg: 'Failed'});
    }
};


exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({err: errors.array(), mail: req.body});
    }
    try {
        let user = await User.findOne({where: {mail: req.body.email}});
        if (user && user.verifyMail === null) {
            const success = await bcrypt.compare(req.body.password, user.password);
            if (success) {
                const token = jwt.sign(
                    {
                        email: user.mail,
                        userId: user.id.toString()
                    },
                    'secret',
                    {expiresIn: '1h'}
                );
                await User.update({
                    auth_key: token,
                    UpdatedAt: new Date()
                }, {where: {id: user.id}});
                return res.status(200).json({user: user, token: token, userId: user.id.toString(), expireIn: '1'});
            } else {

                return res.status(401).json({msg: 'Wrong password !!!', inputField: 'password'});
            }
        } else {
            if (user.verifyMail !== null) {
                return res.status(401).json({msg: 'Verify Your Email Address.', inputField: 'verify'});
            }
            return res.status(401).json({msg: 'A user with this email could not be found.', inputField: 'email'});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({msg: 'Failed'});
    }
};


exports.info = async (req, res) => {
    try {
        const user = await User.findOne({where: {id: req.userId}, include: [{model: Focus, as: 'focu'}]});
        res.status(200).json({msg: 'Success', user: user})
    } catch (error) {
        res.status(500).json({msg: 'Failed', error: error})
    }
};


exports.changeProfileFull = async (req, res) => {
    const firstNameReq = req.body.firstname;
    const lastNameReq = req.body.lastname;
    const avatarReq = req.file.path;
    const phoneReq = req.body.phone;
    let updatedUser;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        let result = await User.update({
            firstName: firstNameReq,
            lastName: lastNameReq,
            avatar: avatarReq,
            phone: phoneReq
        }, {where: {id: req.userId}});
        if (result[0] !== 0) {
            updatedUser = await User.findOne({where: {id: req.userId}});
            res.status(200).json({msg: 'Success', user: updatedUser})
        } else {
            const error = new Error('Error update!!!');
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

exports.changeProfile = async (req, res) => {
    const firstNameReq = req.body.firstname;
    const lastNameReq = req.body.lastname;
    const phoneReq = req.body.phone;
    let updatedUser;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        let result = await User.update({
            firstName: firstNameReq,
            lastName: lastNameReq,
            phone: phoneReq
        }, {where: {id: req.userId}});
        if (result[0] !== 0) {
            updatedUser = await User.findOne({where: {id: req.userId}});
            res.status(200).json({msg: 'Success', user: updatedUser})
        } else {
            const error = new Error('Error update!!!');
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

exports.SocketDisconnect = async (userId) => {
    try {
        await Focus.update({
            state: 'offline',
            userId: userId,
            updatedAt: Date.now()
        }, {where: {userId: userId}});
        let update = await User.findOne({where: {id: userId}, include: {model: Focus, as: 'focu'}});
        socketIO.getIO().sockets.emit('change-state', update);
    } catch (err) {
        console.log(err);
    }
};

exports.SocketConnected = async (userId) => {
    try {
        await Focus.update({
            state: 'online',
            userId: userId,
            updatedAt: Date.now()
        }, {where: {userId: userId}});
        let update = await User.findOne({where: {id: userId}, include: {model: Focus, as: 'focu'}});
        socketIO.getIO().sockets.emit('change-state', update);
    } catch (err) {
        console.log(err);
    }
};

exports.changeMyState = async (req, res) => {
    try {
        let result = await Focus.update({
            state: req.body.state,
            userId: req.userId,
            updatedAt: Date.now()
        }, {where: {userId: req.userId}});
        let update = await User.findOne({where: {id: req.userId},attributes:['id'], include: {model: Focus, as: 'focu',attributes:['state']}});
        socketIO.getIO().sockets.emit('change-state', update);
        res.status(200).json({msg: 'Success', user: update, updated: result[0]});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

exports.verification = async (req, res) => {
    try {
        let update = await User.findOne({where: {mail: req.query.mail, verifyMail: null}});
        if (update) {
            return res.redirect('http://localhost:3000/');
        }
        if (req.query.token) {
            let update = await User.update({verifyMail: null}, {where: {verifyMail: req.query.token}});
            if (update[0] === 1) {
                return res.redirect('http://localhost:3000/');
            } else {
                return res.status(400).json({msg: 'Failed', error: 'Update failed !!!'});
            }
        } else {
            return res.status(400).json({msg: 'Failed', error: 'Token failed !!!'});
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

const sendVerifyMail = async (mail, firstName, code) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
            user: config.mail.mail, //Gmail username
            pass: config.mail.password // Gmail password
        }
    });

    let mailOptions = {
        from: '"Focus Assitant" <focusassistantc45@gmail.com>',
        to: mail, // Recepient email address. Multiple emails can send separated by commas
        subject: 'Email Confirmation',
        html: "      <table style=\"background-color:white\" width=\"100%\" bgcolor=\"#f6f8f1\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n" +
            "            <tr>\n" +
            "                <td>\n" +
            "                    <table align=\"center\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
            "                        <tr>\n" +
            "                            <td style=\"font-size: 32px;color:rgb(25, 0, 255);font-weight: bold\" align=\"center\">\n" +
            "                                Focus-Assistant\n" +
            "                            </td>\n" +
            "                        </tr>\n" +
            "                        <tr>\n" +
            "                            <td>\n" +
            "                                    <img style=\"width:100%\" src=\"https://www.howtogeek.com/wp-content/uploads/2018/11/mailsettingshero.png.pagespeed.ce.9k3yDOy-9S.png\">\n" +
            "                            </td>\n" +
            "                        </tr>\n" +
            "                        <tr align=\"center\">\n" +
            "                            <td style=\"justify-content: center\">\n" +
            "                                    <h2>Email Confirmation</h2>\n" +
            "                                    <p>Hey " + firstName + ", you're almost ready to start enjoing\n" +
            "                                        Focus-Assistant. Simply click the big blue button below to\n" +
            "                                        verify your email address.\n" +
            "                                    </p>\n" +
            "                              <a href='" + config.address + "/users/verification?token=" + code + "&mail=" + mail + "'>  <button style=\"background-color: rgb(29, 149, 240);color: white;font-size: 120%;width: 50%;height: 50px;margin:15px;cursor: pointer;\">Verify email address</button></a>\n" +
            "                            </td>\n" +
            "                        </tr>\n" +
            "                    </table>\n" +
            "                </td>\n" +
            "            </tr>\n" +
            "        </table>"
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

const sendPasswordResetMail = async (mail, firstName, code) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
            user: config.mail.mail, //Gmail username
            pass: config.mail.password // Gmail password
        }
    });

    let mailOptions = {
        from: '"Focus Assitant" <focusassistantc45@gmail.com>',
        to: mail, // Recepient email address. Multiple emails can send separated by commas
        subject: 'Email Confirmation',
        html: "     <table style=\"background-color:white\" width=\"100%\" bgcolor=\"#f6f8f1\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n" +
            "            <tr>\n" +
            "                <td>\n" +
            "                    <table align=\"center\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
            "                        <tr>\n" +
            "                            <td style=\"font-size: 32px;color:rgb(25, 0, 255);font-weight: bold\" align=\"center\">\n" +
            "                                Focus-Assistant\n" +
            "                            </td>\n" +
            "                        </tr>\n" +
            "                        <tr>\n" +
            "                            <td>\n" +
            "                                    <img style=\"width:100%\"src=\"https://www.howtogeek.com/wp-content/uploads/2018/11/mailsettingshero.png.pagespeed.ce.9k3yDOy-9S.png\">\n" +
            "                            </td>\n" +
            "                        </tr>\n" +
            "                        <tr align=\"center\">\n" +
            "                            <td style=\"justify-content: center\">\n" +
            "                                    <h2>Change password</h2>\n" +
            "                                    <p>Hi " + firstName + ",\n" +
            "We received a request to reset your Focus-Assistant password.\n" +
            "Enter the following password reset code:\n" +
            "                                    </p>\n" +
            "\t\t\t\t\t\t\t\t\t<h1 style=\"background-color:blue;color:white\" >" + code + "</h1>\n" +
            "\t\t\t\t\t\t\t</td>\n" +
            "                        </tr>\n" +
            "                    </table>\n" +
            "                </td>\n" +
            "            </tr>\n" +
            "        </table>"
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

exports.resendMailVerification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        let code = cryptoRandomString({length: 24, type: 'url-safe'});
        let name = 'User';
        let user = await User.findOne({where: {mail: req.query.mail}});
        if (user && user.verifyMail !== null) {
            let update = await User.update({verifyMail: code}, {where: {mail: req.query.mail}});
            sendVerifyMail(req.query.mail, name, code);
        }
        return res.status(200).json({msg: 'Success'});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        let code = cryptoRandomString({length: 6, characters: '0123456789'});
        let user = await User.findOne({where: {mail: req.query.mail}});
        if (user) {
            let update = await User.update({resetToken: code, updatedAt: new Date()}, {where: {mail: req.query.mail}});
            if (update[0] === 1) {
                sendPasswordResetMail(user.mail, user.firstName, code);
            }
            return res.status(200).json({msg: 'Success', exist: true});
        } else {
            return res.status(200).json({msg: 'Success', exist: false});
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

exports.confirmResetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const code = req.body.code;
        const mail = req.body.mail;
        const password = req.body.password;
        const confirm = req.body.confirm;

        let user = await User.findOne({
            raw: true,
            where: {
                mail: mail,
                resetToken: code,
                updatedAt: {[op.lt]: new Date((+new Date()) + 1800 * 1000)}
            }
        });
        if (user && password === confirm) {
            let hash = await bcrypt.hash(password, 10);
            let update = await User.update({resetToken: null, password: hash}, {where: {mail: mail}});
            if (update[0] === 1) {
                return res.status(200).json({msg: 'Success', message: 'Change password is complete !!!'})
            } else {
                return res.status(500).json({msg: 'Failed', exist: false, message: 'Update password error!!!'});
            }
        } else {
            return res.status(400).json({msg: 'Failed', exist: false, message: 'Code is wrong or expire !!!'});
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

