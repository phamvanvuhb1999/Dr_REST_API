const User = require('../models/user.model');

const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const Profile = require('../models/profile.model');


module.exports.getAllUser = (req, res, next) => {
    User.find()
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    message: "GET all users ",
                    count: result.length,
                    users: result
                })
            } else {
                res.status(200).json({
                    message: 'GET all users',
                    users: 'users table is empty'
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        })
}

module.exports.getUserDetail = (req, res, next) => {
    let id = req.params.userId;
    User.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    message: "user detail",
                    user: result
                })
            } else {
                res.status(200).json({
                    message: "user detail",
                    user: "no have user with input Id"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: error
            });
        })
}

module.exports.deleteUser = (req, res, next) => {
    let id = req.params.userId;
    User.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                User.remove({ _id: id })
                    .exec()
                    .then(result1 => {
                        res.status(200).json(result1)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        });
                    })
            } else {
                res.status(205).json({
                    message: "No user Deleted.",
                    error: 'NO user with in put ID.'
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        })
}


module.exports.updateUser = (req, res, next) => {
    let id = req.params.userId;
    let password = req.body.password;
    let email = req.body.password;

    User.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                let updateuser = {};
                if (password && password.trim() != "") {
                    updateuser.password = password;
                }
                if (email && validateEmail(email.trim())) {
                    updateuser.email = email.trim();
                }
                User.updateOne({ _id: id }, { $set: updateuser })
                    .exec()
                    .then(result => {
                        res.status(200).json(result)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(205).json({
                            error: err
                        })
                    })
            } else {
                res.status(200).json({
                    message: "user not updated",
                    user: "no have user with input Id"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}

module.exports.signup = (req, res, next) => {
    let email = req.body.email;
    let username = req.body.username;
    User.find({ email: email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: "Username or Email exists."
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = User({
                            email: email,
                            username: username,
                            password: hash
                        })

                        user.save()
                            .then(result => {
                                const profile = new Profile({
                                    fullname: email.split("@")[0],
                                    userId: user._id,
                                    friends: [],
                                    conversation_ids: [],
                                })

                                profile.save()
                                    .then(result1 => {
                                        res.status(201).json({
                                            message: "User and Profile were created.",
                                            user: result,
                                            profile: result1,
                                        })
                                    })
                                    .catch(erro => {
                                        res.status(500).json({
                                            error: erro,
                                        })
                                    })
                            })
                            .catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    error: error
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            })
        });
}

module.exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(users => {
            if (users.length > 0) {
                bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth failed.'
                        })
                    }
                    const newSessionToken = shortid.generate();
                    if (result) {
                        User.updateOne({ email: users[0].email }, {
                                sessionToken: newSessionToken
                            }).exec()
                            .then(modidy => {
                                const token = jwt.sign({
                                        email: users[0].email,
                                        userId: users[0]._id,
                                        sessionToken: newSessionToken,
                                    },
                                    process.env.JWT_KEY, {
                                        expiresIn: "4h"
                                    },
                                );
                                return res.status(200).json({
                                    message: 'Auth successfuly.',
                                    token: token
                                })
                            })
                            .catch(error => {
                                res.status(401).json({
                                    message: "Auth Failed."
                                })
                            })

                    }
                })
            } else {
                res.status(401).json({
                    message: 'Auth failed.'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            })
        })
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}