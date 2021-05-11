const express = require('express')
const router = express.Router();

const mongoose = require('mongoose');

//const commentController = require('../controllers/controller.comments');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const Conversation = require('../models/conversation.model');

const tokenMiddleware = require('../middlewares/check.token');
const permissionMiddleware = require('../middlewares/check.permission.admin');

const RES = require('./response');



//get all conversations 
router.get('/', tokenMiddleware, function(req, res, next) {
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
router.get('/:profileId', tokenMiddleware, function(req, res, next) {
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
                return RES.responseNoPermission(res, "No permission to get all conversation from orther user profile.");
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
    const user_data = req.userData;
    const form = req.body;

    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            console.log(profile);
            const newConversation = {};
            newConversation.author_id = profile._id;
            if (form.name) {
                newConversation.name = " " + form.name;
            } else {
                newConversation.name = profile.fullname + "";
            }

            if (form.member_ids.length > 0) {
                newConversation.member_ids = form.member_ids.map(x =>
                    mongoose.Types.ObjectId(x)
                )
            }

            newConversation.member_ids.push(profile._id);

            const conversation = new Conversation(newConversation)
            conversation.save()
                .then(result => {
                    Profile.updateMany({
                            _id: { $in: newConversation.member_ids }
                        }, {
                            $push: { "conversation_ids": result._id }
                        })
                        .exec()
                        .then(result1 => {
                            return RES.responseNormal(res, result, "Conversation was created and Profiles was modify.");
                        })
                        .catch(erro => {
                            return RES.resMessage(res, erro, 500);
                        })
                })
                .catch(error => {
                    return RES.resMessage(res, error, 500);
                })
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//update conversation
router.patch('/:conversationId', tokenMiddleware, function(req, res, next) {
    const id = req.params.conversationId;
    const form = req.body;
    const user_data = req.userData;

    Conversation.findOne({ _id: id })
        .exec()
        .then(conversation => {
            let removed = [];
            let added = [];
            if (form.name.trim() != "") {
                conversation.name = form.name.trim();
            }
            if (form.member_ids) {
                if (form.member_ids.length > 0) {
                    for (item in form.member_ids) {
                        let index = conversation.member_ids.indexOf(item);
                        if (index >= 0) {
                            remove.push(conversation.member_ids.splice(index, 1));
                        } else {
                            conversation.menber_ids.push(mongoose.Types.ObjectId(item));
                            added.push(mongoose.Types.ObjectId(item));
                        }
                    }
                }
            }
            conversation.save()
                .then(result => {
                    Profile.updateMany({
                            _id: { $in: added }
                        }, {
                            $push: { "conversation_ids": result._id }
                        })
                        .exec()
                        .then(result1 => {
                            return RES.responseNormal(res, result, "Conversation was Updated.");
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
});

//delete conversation
router.delete('/:conversationId', tokenMiddleware, function(req, res, next) {

});


module.exports = router;