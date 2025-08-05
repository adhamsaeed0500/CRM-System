const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
    let token;
    if(req.headers.client === 'not-browser'){
        token = req.headers.authorization;
    }else{
        token = req.cookies['Authorization'];
    }

    try {
        userToken = token.split(' ')[1];
        jwtVerfied = jwt.verify(userToken , process.env.JWT_SECRET);
        if(jwtVerfied){
            req.user = jwtVerfied;
            next()
        }else{
            return res.status(400).json({success:false , message:'invalid token'})
        }      
    } catch (error) {
        return res.status(400).json({success:false , message:'invalid token'})
    }
};