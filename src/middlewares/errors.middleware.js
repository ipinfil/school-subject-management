const { HTTP_STATUS } = require('../constants');

function notFound(req, res, next) {
    res.status(HTTP_STATUS.NOT_FOUND);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
    /* eslint-enable no-unused-vars */
    const statusCode = res.statusCode !== HTTP_STATUS.OK ? res.statusCode : HTTP_STATUS.SERVER_ERROR;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}

module.exports = {
    notFound,
    errorHandler,
};