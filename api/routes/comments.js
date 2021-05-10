const express = require('express')
const router = express.Router();

const commentController = require('../controllers/controller.comments');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const Conversation = require('../models/conversation.model');

const tokenMiddleware = require('../middlewares/check.token');
const permitionMiddleware = require('../middlewares/check.permition.admin');

const RES = require('./response');



//get all comments from specific user profile
router.get('/:profileId', tokenMiddleware, function(req, res, next) {
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
                    return RES.responseNoPermition(res, "Have No permition to get other user's comment.")
                }
            } else {
                return RES.resMessage(res, error, 500);
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })

});

//get all comments from specific post
router.get('/:postId', tokenMiddleware, function(req, res, next) {
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
});

//get all comments from specific conversation
router.get('/:conversationId', tokenMiddleware, function(req, res, next) {
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
});

//get all comments
router.get('/', tokenMiddleware, function(req, res, next) {
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
});

//get single comment
router.get('/:commentId', tokenMiddleware, function(req, res, next) {
    const id = req.body.commentId;
    Comment.find({ _id: id })
        .exec()
        .then(userInfo => {
            return RES.responseNormal(res, userInfo, "Commet Information.");
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//create comment
router.post('/', tokenMiddleware, function(req, res, next) {
    let user = req.userData;
    let conversation_id = req.body.conversation_id;
    let content = req.body.content;
    let attached = req.body.attached;

    Conversation.findOne({ _id: conversation_id })
        .exec()
        .then(conversation => {
            if (conversation) {
                const comment = Comment({
                    author_id: user.userId,
                    conversation_id: conversation_id,
                    content: content,
                    attached: attached,
                });
                comment.save()
                    .then(result => {
                        console.log(result);
                        return RES.responseNormal(res, result, "Comment was Created.");
                    })
                    .catch(erro => {
                        return RES.resMessage(res, erro, 500);
                    })
            } else {
                return RES.responseDataEmpty(res, "Conversation id invalid.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })

});

//udpate comment
router.patch('/:commentId', tokenMiddleware, function(req, res, next) {
    const user = req.userData;
    const commentId = req.params.commentId;
    const newComment = {};
    if (req.body.content) {
        newComment.content = req.body.content;
    }
    if (req.body.attached) {
        newComment.attached = req.body.attached;
    }

    Comment.findOne({ _id: commentId })
        .exec()
        .then(comment => {
            if (comment) {
                if (user.userId == comment.author_id) {
                    Comment.updateOne({ _id: commentId }, { $set: newComment })
                        .exec()
                        .then(result => {
                            return RES.responseNormal(res, result, "Comment was Updated.");
                        })
                        .catch(erro => {
                            return RES.resMessage(res, erro, 500);
                        })
                } else {
                    return RES.responseNoPermition(res, "Not the commit's author");
                }
            } else {
                return RES.responseDataEmpty(res, "No comment with Id.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//delete comment
router.delete('/:commentId', tokenMiddleware, function(req, res, next) {
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
                    return RES.responseNoPermition(res, "Not the comment's author");
                }
            } else {
                return RES.responseDataEmpty(res, "No comment with Id.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});


module.exports = router;