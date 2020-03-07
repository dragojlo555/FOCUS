const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStartegy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const keys=require('../config/keys');

const User = require('../models').User;

module.exports= async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({msg: 'Authorization failed'});
    }
    const token = authHeader.split(' ')[1];
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token,keys.jtwsecret);
        const u = await User.findOne({where: {id: decodedToken.userId, auth_key: token}});
        if (!u) {
            return res.status(401).json({msg: 'Authorization failed', user: u});
        }
    } catch (err) {
        return res.status(401).json({msg: 'Authorization failed-'});
    }
    req.userId = decodedToken.userId;
    next();
};

/*
module.exports = passport => passport.use('jwt', new JwtStartegy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: 'secret',
    passReqToCallback: true
}, async (req,payload, done) => {
    try {
        const authHeader = req.get('Authorization');
        const token = authHeader.split(' ')[1];

        req.userId=payload.userId;
        const u = await User.findOne({raw:true,where: {id: payload.userId, auth_key: token}});
        if(!u){
            throw new Error('Authorization failed');
        }
        console.log(payload);
        done(null, payload);
    } catch (error) {
        done(error, false);
    }
}));*/
