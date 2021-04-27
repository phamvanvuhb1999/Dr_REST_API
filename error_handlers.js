module.exports.throws = (req, res, next) => {
    const error = new Error('Not found route!');
    error.status = 404;
    next(error);
}


module.exports.shows = (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
}