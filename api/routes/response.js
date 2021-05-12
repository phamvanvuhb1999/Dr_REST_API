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

module.exports.getUpload = function(path, limitFileSize, filetypes = '') {
    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './' + path);
        },
        filename: function(req, file, cb) {
            let newFileName = new Date().toISOString().replace(':', '-');
            newFileName += file.originalname;
            newFileName = newFileName.replace(':', '-');
            cb(null, newFileName);
        }
    });

    const fileFilter = (req, file, cb) => {
        let test = filetypes.test(file.mimetype);
        if (filetypes.toString().trim() == "" || test) {
            cb(null, true);
        }
        cb(null, false);
    }

    return upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * parseInt(limitFileSize)
        },
        fileFilter: fileFilter
    });
}