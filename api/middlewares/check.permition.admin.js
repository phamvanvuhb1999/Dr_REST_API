const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = function(req, res, next) {
    const Admin = process.env.admin_email;
    User.findOne({ email: Admin }).exec()
        .then(admin => {
            if (admin) {
                if (admin.email == req.userData.email) {
                    next()
                } else {
                    res.status(200).json({
                        message: "Permition Failed."
                    })
                }
            }
        })
        .catch(error => {
            res.status(200).json({
                error: error,
                message: "Permition Failed."
            })
        })
}