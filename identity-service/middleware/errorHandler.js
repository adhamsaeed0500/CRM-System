const logger = require('../utils/logger');

const errorHandler = (err, res, res, next)=>{
    logger.error(err.satck);

    res.status(err.status || 500).json({
        message: err.message || 'internal server error'
    });
};

module.exports = errorHandler;