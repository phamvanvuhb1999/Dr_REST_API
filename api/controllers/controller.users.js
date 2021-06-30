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
    let user_data = req.userData;
    let id = req.params.userId;
    User.findOne({ _id: id })
        .exec()
        .then(result => {
            if (result._id + "" == user_data.userId) {
                res.status(200).json({
                    message: "user detail",
                    user: result
                })
            } else {
                res.status(404).json({
                    message: "Have no permission to get orther user's information.",
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
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                Profile.findOne({ userId: user._id })
                    .exec()
                    .then(profileRaw => {
                        function clearLink(link) {
                            //https://drive.google.com/file/d/18Rs9hG2JIFhM5D70KsDdG74_LLsXkhlL/view?usp=sharing
                            let result = link.replace("file/d/", "uc?id=");
                            result = result.replace('/view?usp=sharing', '');
                            return result;
                        }
                        let profile = { fullname: profileRaw.fullname, _id: profileRaw._id, avatar: clearLink(profileRaw.avatar) || "" }
                        bcrypt.compare(req.body.password, user.password, (error1, result) => {
                            if (error1 || !result) {
                                return res.status(200).json({
                                    message: 'Auth failed, Wrong password.',
                                    error: error1,
                                    profile: profile
                                })
                            }
                            const newSessionToken = shortid.generate();
                            if (result) {
                                User.updateOne({ email: user.email }, {
                                        sessionToken: newSessionToken
                                    }).exec()
                                    .then(modidy => {
                                        const token = jwt.sign({
                                                email: user.email,
                                                userId: user._id,
                                                sessionToken: newSessionToken,
                                                profile: profile
                                            },
                                            process.env.JWT_KEY, {
                                                expiresIn: "4h"
                                            },
                                        );
                                        return res.status(200).json({
                                            message: 'Auth successfuly.',
                                            token: token,
                                            profile: profile
                                        })
                                    })
                                    .catch(error2 => {
                                        return res.status(401).json({
                                            message: "Auth Failed.",
                                            error: error2
                                        })
                                    })

                            }
                        })
                    })
                    .catch(error3 => {
                        return res.status(401).json({
                            message: "Auth Failed.",
                            error: error3
                        })
                    })
            } else {
                res.status(404).json({
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