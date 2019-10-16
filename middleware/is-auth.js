const jwt = require('jsonwebtoken');
const User=require('../models').User;

module.exports = async (req, res, next) => {
    const authHeader=req.get('Authorization');
    if(!authHeader){
        return res.status(401).json({msg:'Authorization failed'});
    }
    const token=authHeader.split(' ')[1];
    let decodedToken=null;
    try {
        decodedToken = jwt.verify(token, 'secret');
        const  u=await User.findOne({where:{id:decodedToken.userId,auth_key:token}});
      if(!u){
          return res.status(401).json({msg:'Authorization failed',user:u});
      }
    }catch(err){
        return res.status(401).json({msg:'Authorization failed'});
    }
    req.userId=decodedToken.userId;
    next();
};
