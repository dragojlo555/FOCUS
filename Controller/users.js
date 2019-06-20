const User = require('../models/user');
const Reminder = require('../models/reminder');
const Focus=require('../models/focus');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const socketIO=require('../util/socket');

exports.getDefault = (req, res) => {
    res.json({msg: 'Users Works'});
};


exports.allUser=(req,res)=>{
    User.findAll().then(data=>
        res.status(200).json({msg:'Success',users:data})
    ).catch(err=>{
        res.status(400).json({msg:'Failed',error:err})
    })
};

exports.createUser = async (req, res) => {
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
    try {
        let hash = await bcrypt.hash(pass, 10);
        let NewUser =await User.create({
            lastName: lastNameReq,
            password: hash,
            mail: emailReq,
            firstName: firstNameReq,
            Avatar: avatarReq
        });


        if (NewUser) {
            let focus =await Focus.create({
                state: 'work',
                userId: NewUser.id
            });
        }

        if (NewUser) {
            return res.status(201).json({message: 'User created !!!', user:NewUser});
        } else {
            return res.status(500).json({msg: 'Internal server error !!!'});
        }
    }catch(err){
        console.log(err);
        return res.status(503).json({msg:'Error !!!!!!!!!!'});
    }
};

exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({err:errors.array(),mail:req.body});
    }

    let user=await User.findOne({where: {mail: req.body.email}});
    if(user){
        const success=await bcrypt.compare(req.body.password,user.password);
        if(success){
            const token = jwt.sign(
                {
                    email: user.mail,
                    userId: user.id.toString()
                },
                'secret',
                {expiresIn: '1h'}
            );
            return res.status(200).json({user:user,token: token, userId: user.id.toString(),expireIn: '1'});
        }else {

            return res.status(401).json({msg:'Wrong password !!!',inputField:'password'});}
    }else{
        return res.status(401).json({msg:'A user with this email could not be found.',inputField:'email'});
    }
};


exports.info =async (req, res) =>{
    try {
        const user = await User.findOne({where: {id: req.userId},include:[{model:Focus}]});
        res.status(200).json({msg: 'Success', user: user})
    }catch(error) {
        res.status(500).json({msg: 'Failed', error: error})
    }
};


exports.changeProfile = async(req, res) => {
    const firstNameReq = req.body.firstname;
    const lastNameReq = req.body.lastname;
    const avatarReq= req.file.path;
    let updatedUser;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try {
        let result = await User.update({
            firstName: firstNameReq,
            lastName: lastNameReq,
            Avatar: avatarReq
        }, {where: {id: req.userId}});
        if (result[0] !== 0) {
            updatedUser = await User.findOne({where: {id: req.userId}});
            res.status(200).json({msg: 'Success', updated: updatedUser})
        }else{
            const error = new Error('Error update!!!');
            error.statusCode = 401;
            throw error;
        }
    }catch(err){
        if(!err.statusCode)err.statusCode=500;
            return res.status(err.statusCode).json({msg: 'Failed', error: err});
        }
};

exports.changeMyState=async(req,res)=>{
    try {
        let result = await Focus.update({
            state: req.body.state,
            userId: req.userId
        }, {where: {userId: req.userId}});
        let update=await User.findOne({where:{id:req.userId},include:{model:Focus}});
        socketIO.getIO().sockets.emit('change-state',update);
        res.status(200).json({msg: 'Success', user: update,updated:result[0]});
    }catch (err) {
        if(!err.statusCode)err.statusCode=500;
        return res.status(err.statusCode).json({msg: 'Failed', error: err});
    }
};

