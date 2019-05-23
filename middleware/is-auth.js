const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader=req.get('Authorization');
    if(!authHeader){
        return res.status(401).json({msg:'Authorization failed'});
    }
    const token=authHeader.split(' ')[1];
    let decodedToken=null;
    try {
        decodedToken = jwt.verify(token, 'secret')
    }catch(err){
        return res.status(401).json({msg:'Failed'});
    }
    req.userId=decodedToken.userId;
    next();
};