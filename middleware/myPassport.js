const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStartegy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const User = require('../models').User;
const Focus = require('../models').Focus;

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

passport.serializeUser(function (user,done){
    done(null,user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy(
    {
        clientID: keys.googleClientId,
        clientSecret: keys.googleSecretId,
        callbackURL: '/api/users/auth/google/callback',
        passReqToCallback: true,
    }, async (req,accessToken, refreshToken, profile, done) => {
        // console.log('access token', accessToken);
        try {
            let user = {
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            };
            const baseUser =await User.findOne({raw: true, where: {googleId: user.googleId}});
            if(baseUser){
                const token = await jwt.sign(
                    {
                        email: user.email,
                        userId: baseUser.id.toString()
                    },
                    keys.jtwsecret,
                    {expiresIn: '1h'}
                );
                await User.update({
                    auth_key: token,
                    UpdatedAt: new Date()
                },{where: {id: baseUser.id}});

                user.token=token;
                user.id=baseUser.id;
            }else{
                console.log('!User exists');
                let NewUser = await User.create({
                    lastName: user.lastName,
                    password: 'null',
                    mail: user.email,
                    avatar: user.avatar,
                    firstName: user.firstName,
                    phone: null,
                    verifyMail: null,
                    googleId:user.googleId
                });
                if (NewUser) {
                    await Focus.create({
                        state: 'work',
                        userId: NewUser.id
                    });
                }
                const token = await jwt.sign(
                    {
                        email: user.email,
                        userId: NewUser.id.toString()
                    },
                    keys.jtwsecret,
                    {expiresIn: '1h'}
                );
                await User.update({
                    auth_key: token,
                    UpdatedAt: new Date()
                },{where: {id: NewUser.id}});

                user.token=token;
                user.id=NewUser.id;
            }
            done(null, user);
        }catch (error) {
            done(error,false,error.message);
        }
    }
));

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
}));
