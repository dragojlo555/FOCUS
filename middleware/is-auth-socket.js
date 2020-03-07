const jwt = require('jsonwebtoken');
const keys=require('../config/keys');

exports.checkAuth=(token)=>{
    let decodedToken=null;
    try {
        decodedToken = jwt.verify(token, keys.jtwsecret)
    }catch(err){
        return null;
    }
  return decodedToken.userId;
};