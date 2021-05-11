const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = function(req, res, next) {
    const currentUserEmail = req.userData.email;
    User.findOne({ email: currentUserEmail })
        .exec()
        .then(adminUser => {
            if (adminUser.isAdmin) {
                next();
            } else {
                res.status(200).json({
                    message: "Permission Failed."
                })
            }
        })
        .catch(error => {
            res.status(200).json({
                error: error,
                message: "Permission Failed."
            })
        })
}