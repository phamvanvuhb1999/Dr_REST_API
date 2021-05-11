module.exports.resMessage = function resMessage(res, error, state) {
    return res.status(state)
        .json({
            error: error,
        });
}


module.exports.responseNormal = function(res, data, message) {
    return res.status(200).json({
        message: message,
        data_size: data.length,
        data: data,
    })
}

module.exports.responseDataEmpty = function(res, message) {
    return res.status(404).json({
        message: message
    })
}

module.exports.responseNoPermission = function(res, message) {
    return res.status(403).json({
        message: message
    })
}