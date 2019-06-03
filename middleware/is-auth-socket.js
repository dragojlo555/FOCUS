const jwt = require('jsonwebtoken');


exports.checkAuth=(token)=>{
    let decodedToken=null;
    try {
        decodedToken = jwt.verify(token, 'secret')
    }catch(err){
        return null;
    }
  return decodedToken.userId;
};