const User = require('../models/user');
const Focus = require('../models/focus');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const socketIO = require('../util/socket');

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

exports.createUser = async (req, res) => {
    const pass = req.body.password;
    const emailReq = req.body.email;
    const firstNameReq = req.body.firstname;
    const lastNameReq = req.body.lastname;
    const avatarReq = req.file.path;
    const phoneReq=req.body.phone;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    try {
        let hash = await bcrypt.hash(pass, 10);
        let NewUser = await User.create({
            lastName: lastNameReq,
            password: hash,
            mail: emailReq,
            firstName: firstNameReq,
            avatar: avatarReq,
            phone:phoneReq
        });
        if (NewUser) {
            await Focus.create({
                state: 'work',
                userId: NewUser.id
            });
        }
        return res.status(200).json({message: 'Success', user: NewUser});
    } catch (err) {
        console.log(err);
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
        if (user) {
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
                return res.status(200).json({user: user, token: token, userId: user.id.toString(), expireIn: '1'});
            } else {

                return res.status(401).json({msg: 'Wrong password !!!', inputField: 'password'});
            }
        } else {
            return res.status(401).json({msg: 'A user with this email could not be found.', inputField: 'email'});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({msg: 'Failed'});
    }
};


exports.info = async (req, res) => {
    try {
        const user = await User.findOne({where: {id: req.userId}, include: [{model: Focus}]});
        res.status(200).json({msg: 'Success', user: user})
    } catch (error) {
        res.status(500).json({msg: 'Failed', error: error})
    }
};


exports.changeProfileFull = async (req, res) => {
    const firstNameReq = req.body.firstname;
    const lastNameReq = req.body.lastname;
    const avatarReq = req.file.path;
    const phoneReq=req.body.phone;
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
            phone:phoneReq
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
    const phoneReq=req.body.phone;
    let updatedUser;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        let result = await User.update({
            firstName: firstNameReq,
            lastName: lastNameReq,
            phone:phoneReq
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
        let update = await User.findOne({where: {id: userId}, include: {model: Focus}});
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
        let update = await User.findOne({where: {id: userId}, include: {model: Focus}});
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
        let update = await User.findOne({where: {id: req.userId}, include: {model: Focus}});
        socketIO.getIO().sockets.emit('change-state', update);
        res.status(200).json({msg: 'Success', user: update, updated: result[0]});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err.message});
    }
};

