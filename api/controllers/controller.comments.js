const Comment = require("../models/comment.model");
const Conversation = require('../models/conversation.model');
const Profile = require('../models/profile.model');
const Post = require('../models/post.model');

const RES = require('../routes/response');

module.exports.getAll = function(req, res, next) {
    Comment.find({})
        .exec()
        .then(comments => {
            if (comments.length > 0) {
                return RES.responseNormal(res, comments, "All messages.");
            } else {
                return RES.responseDataEmpty(res, "No comment was created.")
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.getAllWithProfile = function(req, res, next) {
    const profileId = req.params.profileId;
    const user_data = req.userData;

    //verify user and profile
    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            if (profile) {
                if (profile._id == profileId) {
                    Comment.find({ author_id: profileId })
                        .exec()
                        .then(comments => {
                            if (comments.length > 0) {
                                return RES.responseNormal(res, comments, "all Comments from a specific profile.");
                            } else {
                                return RES.responseDataEmpty(res, "Comment list is Empty.");
                            }
                        })
                        .catch(erro => {
                            return RES.resMessage(res, erro, 500);
                        })
                } else {
                    return RES.responseNopermission(res, "Have No permission to get other user's comment.")
                }
            } else {
                return RES.resMessage(res, error, 500);
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })

}

module.exports.getAllWithPost = function(req, res, next) {
    const postId = req.params.postId;
    const user_data = req.userData;
    Post.findOne({ _id: postId })
        .exec()
        .then(post => {
            if (post) {
                Comment.find({ _id: { $in: post.comment_ids } })
                    .exec()
                    .then(comments => {
                        if (comments.length > 0) {
                            return RES.responseNormal(res, comments, "All comments in post.");
                        } else {
                            return RES.responseDataEmpty(res, "No Comment in Post");
                        }
                    })
                    .catch(erro => {
                        return RES.resMessage(res, erro, 500);
                    })
            } else {
                return RES.resMessage(res, "", 500);
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.getAllWithConversation = function(req, res, next) {
    const conversation_id = req.params.conversationId;
    Conversation.findOne({ _id: conversation_id })
        .exec()
        .then(conversation => {
            Comment.find({ conversation_id: conversation._id })
                .exec()
                .then(comments => {
                    if (comments.length > 0) {
                        return RES.responseNormal(res, comments, "All comment in conversation");
                    } else {
                        return RES.responseDataEmpty(res, "No comment in conversation.")
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

module.exports.getSingle = function(req, res, next) {
    const id = req.body.commentId;
    Comment.find({ _id: id })
        .exec()
        .then(userInfo => {
            return RES.responseNormal(res, userInfo, "Commet Information.");
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.create = function(req, res, next) {
    let user = req.userData;
    let conversation_id = req.body.conversation_id;
    let content = req.body.content;
    let attached = ""
    if (req.file) {
        attached = req.file.path;
    } else if (req.body.attached) {
        attached = req.body.attached;
    }

    Profile.findOne({ userId: user.userId })
        .exec()
        .then(profile => {
            Conversation.findOne({ _id: conversation_id })
                .exec()
                .then(conversation => {
                    let index = conversation.member_ids.indexOf(profile._id);
                    if (conversation.in_post || index > -1) {
                        const comment = Comment({
                            author_id: profile._id,
                            conversation_id: conversation_id,
                            content: content,
                            attached: attached,
                        });
                        comment.save()
                            .then(result => {
                                console.log(result);
                                //add user to conversation if not in, because in_post == true
                                // if(conversation.in_post){
                                //     let convesation_members = conversation.member_ids;
                                //     if(conversation.member_ids.index(profile._id) < 0){
                                //         conversation.me
                                //     }
                                // }
                                return RES.responseNormal(res, result, "Comment was Created.");
                            })
                            .catch(erro => {
                                return RES.resMessage(res, erro, 500);
                            })
                    } else {
                        return RES.responseNoPermission(res, "No permission to add comment in private conversation");
                    }
                })
                .catch(error => {
                    return RES.resMessage(res, error, 500);
                })
        })
        .catch(err => {
            return RES.resMessage(res, err, 500);
        })

}

module.exports.update = function(req, res, next) {
    const user = req.userData;
    const commentId = req.params.commentId;
    const newComment = {};
    if (req.body.content) {
        newComment.content = req.body.content;
    }
    if (req.body.attached) {
        newComment.attached = req.body.attached;
    } else if (req.file) {
        newComment.attached = req.file.path;
    }

    Comment.findOne({ _id: commentId })
        .exec()
        .then(comment => {
            Profile.findOne({ userId: user.userId })
                .exec()
                .then(profile => {
                    if (profile._id + "" == comment.author_id) {
                        Comment.updateOne({ _id: commentId }, { $set: newComment })
                            .exec()
                            .then(result => {
                                return RES.responseNormal(res, result, "Comment was Updated.");
                            })
                            .catch(erro => {
                                return RES.resMessage(res, erro, 500);
                            })
                    } else {
                        return RES.responseNopermission(res, "Not the commit's author");
                    }
                })
                .catch(err => {
                    return RES.resMessage(res, err, 500);
                })
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.delete = function(req, res, next) {
    const user = req.userData;

    Comment.findOne({ _id: commentId })
        .exec()
        .then(comment => {
            if (comment) {
                if (user.userId == comment.author_id) {
                    Comment.deleteOne({ _id: commentId })
                        .exec()
                        .then(result => {
                            return RES.responseNormal(res, result, "Comment was Deleted.");
                        })
                        .catch(erro => {
                            return RES.resMessage(res, erro, 500);
                        })
                } else {
                    return RES.responseNopermission(res, "Not the comment's author");
                }
            } else {
                return RES.responseDataEmpty(res, "No comment with Id.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}