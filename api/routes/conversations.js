const express = require('express')
const router = express.Router();

//const commentController = require('../controllers/controller.comments');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const Conversation = require('../models/conversation.model');

const tokenMiddleware = require('../middlewares/check.token');
const permitionMiddleware = require('../middlewares/check.permition.admin');

const RES = require('./response');



//get all conversations 
router.get('/', function(req, res, next) {
    const profileId = req.params.profileId;
    const user_data = req.userData;
    Conversation.find({})
        .exec()
        .then(conversations => {
            if (conversations.length > 0) {
                return RES.responseNormal(res, conversations, "All conversations GET.");
            } else {
                return RES.responseDataEmpty(res, "No conversation was Created.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//get all conversation from specific profile
router.get('/:profileId', function(req, res, next) {
    const profileId = req.params.profileId;
    const user_data = req.userData;
    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            if (profile._id == profileId) {
                Conversation.find({ author_id: profileId })
                    .exec()
                    .then(conversations => {
                        if (conversations.length > 0) {
                            return RES.responseNormal(res, conversations, "All conversations GET.");
                        } else {
                            return RES.responseDataEmpty(res, "No conversation was Created.");
                        }
                    })
                    .catch(erro => {
                        return RES.resMessage(res, erro, 500);
                    })
            } else {
                return RES.responseNoPermition(res, "No permition to get all conversation from orther user profile.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//get single conversation
router.get('/:conversationId', tokenMiddleware, function(req, res, next) {
    const id = req.body.conversationId;
    Conversation.find({ _id: id })
        .exec()
        .then(userInfo => {
            return RES.responseNormal(res, userInfo, "Conversation Information.");
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//create conversation
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

//udpate conversation
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

//delete conversation
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