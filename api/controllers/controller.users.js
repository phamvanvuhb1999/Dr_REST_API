const User = require('../models/user.model');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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

    User.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                let updateuser = {
                    name: req.body.newName || result.name,
                    price: req.body.price || result.price,
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
                                res.status(201).json({
                                    message: 'User Created'
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
                    if (result) {
                        const token = jwt.sign({
                                email: users[0].email,
                                userId: users[0]._id
                            },
                            process.env.JWT_KEY, {
                                expiresIn: "1h"
                            },
                        );
                        return res.status(200).json({
                            message: 'Auth successfuly.',
                            token: token
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