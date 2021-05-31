const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const Conversation = require('../models/conversation.model');

const mongoose = require('mongoose');

const shortId = require('shortid');

const RES = require('../routes/response');
const drive = require('./controller.drive');


module.exports.getAll = function(req, res, next) {

    Post.find({})
        .exec()
        .then(posts => {
            if (posts.length > 0) {
                return RES.responseNormal(res, posts, "All post from application.");
            } else {
                return RES.responseDataEmpty(res, "No Post was Created.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.getSingle = function(req, res, next) {
    const postId = req.params.postId;
    Post.find({ _id: postId })
        .exec()
        .then(post => {
            return RES.responseNormal(res, post, "Post Detail.")
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.getWithProfile = function(req, res, next) {
    const profileId = req.params.profileId;
    Post.find({ author_id: profileId })
        .exec()
        .then(posts => {
            if (posts.length > 0) {
                return RES.responseNormal(res, posts, "All posts from user.");
            } else {
                return RES.responseDataEmpty(res, "Have no post from user.");
            }
        })
        .catch(erro => {
            return RES.resMessage(res, erro, 500);
        })
}

module.exports.create = async function(req, res, next) {
    // {
    //     fieldname: 'attached',
    //     originalname: 'Screenshot 2021-04-13 164144.png',
    //     encoding: '7bit',
    //     mimetype: 'image/png',
    //     destination: './uploads/posts',
    //     filename: '2021-05-31T07-39-54.352ZScreenshot 2021-04-13 164144.png',
    //     path: 'uploads\\posts\\2021-05-31T07-39-54.352ZScreenshot 2021-04-13 164144.png',
    //     size: 45210
    //   }
    const user_data = req.userData;
    const content = req.body.content;
    let attached = null;
    if (req.body.attached && typeof req.body.attached === 'string') {
        attached = req.body.attached;
    } else if (req.file) {
        try {
            attached = await drive.uploadAndGetLink(req.file.path);
        } catch (err) {
            console.log(err);
        }
    }
    if (content || attached) {
        const post = {};
        if (content) {
            post.content = content;
        }
        if (attached && attached.trim() != "") {
            post.attached = attached;
        }
        Profile.findOne({ userId: user_data.userId })
            .exec()
            .then(profile => {
                let conversationData = {};
                conversationData.author_id = profile._id;
                conversationData.name = "" + shortId.generate();
                conversationData.member_ids = [];
                conversationData.member_ids.push(profile._id);
                conversationData.in_post = true;
                let conversation = new Conversation(conversationData);
                conversation.save()
                    .then(result => {
                        post.author_id = profile._id;
                        post.conversation_id = result._id;
                        const newPost = new Post(post);
                        newPost.save()
                            .then(result1 => {
                                profile.conversation_ids.push(result._id)
                                profile.save()
                                    .then(result2 => {
                                        return RES.responseNormal(res, result1, "Post was Created.");
                                    })
                                    .catch(er => {
                                        return RES.resMessage(res, er, 500);
                                    })
                            })
                            .catch(err => {
                                return RES.resMessage(res, err, 500);
                            })
                    })
                    .catch(erro => {
                        return RES.resMessage(res, erro, 500);
                    })
            })
            .catch(error => {
                return RES.resMessage(res, error, 500);
            })
    } else {
        return RES.responseNormal(res, null, "Post create invalid.");
    }

}

module.exports.update = async function(req, res, next) {
    const postId = req.params.postId;
    const user_data = req.userData;
    const content = req.body.content;
    let attached = null;
    if (req.body.attached && typeof req.body.attached === 'string') {
        attached = req.body.attached;
    } else if (req.file) {
        try {
            attached = await drive.uploadAndGetLink(req.file.path);
        } catch (err) {
            console.log(err);
        }
    }

    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            Post.findOne({ _id: postId })
                .exec()
                .then(post => {
                    if (profile._id + "" == post.author_id) {
                        let flag = false;
                        if (content) {
                            post.content = content;
                            flag = true;
                        }
                        if (attached && attached.trim() != "") {
                            post.attached = attached;
                            flag = true
                        }
                        if (flag) {
                            post.save()
                                .then(result => {
                                    return RES.responseNormal(res, result, "Post was updated.");
                                })
                                .catch(err => {
                                    return RES.resMessage(res, err, 500);
                                })
                        } else {
                            return RES.responseNormal(res, result, "Post was updated.");
                        }

                    } else {
                        return RES.responseNoPermission(res, "No permission to update other user's post.");
                    }
                })
                .catch(erro => {
                    return RES.resMessage(res, erro, 500);
                })
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.delete = function(req, res, next) {
    const user_data = req.userData;
    const postId = req.params.postId;
    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            Post.findOne({ _id: postId })
                .exec()
                .then(post => {
                    if (profile._id + "" == post.author_id) {
                        Post.deleteOne({ _id: postId })
                            .exec()
                            .then(result => {
                                return RES.responseNormal(res, result, "Post was deleted.");
                            })
                            .catch(erro => {
                                console.log(erro);
                                return RES.resMessage(res, erro, 500);
                            })
                    } else {
                        return RES.responseNoPermission(res, "Have no permission to delele orther people's post.");
                    }
                })
                .catch(erro => {
                    return RES.resMessage(res, erro, 500);
                })
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}