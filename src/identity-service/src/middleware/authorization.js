exports.authorize = (roles = []) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if(!roles.includes(user.role)){
                return res.status(403).json({ message: 'Invalid role' });
            }else{
                next();
            }
            
        } catch (error) {
            res.status(500).json({ message: 'Authorization failed', error: error.message });      
        }
    }
};