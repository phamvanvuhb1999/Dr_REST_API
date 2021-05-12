const Conversation = require('../models/conversation.model');
const Profile = require('../models/profile.model');

const mongoose = require('mongoose');

const RES = require('../routes/response');

module.exports.getAll = function(req, res, next) {
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
}

module.exports.getWithProfile = function(req, res, next) {
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
};

module.exports.getSingle = function(req, res, next) {
    const id = req.body.conversationId;
    Profile.findOne({ userId: req.userData.userId })
        .exec()
        .then(profile => {
            let index = profile.conversation_ids.indexOf(id);
            if (index > -1) {
                Conversation.find({ _id: id })
                    .exec()
                    .then(conversation => {
                        return RES.responseNormal(res, conversation, "Conversation Information.");
                    })
                    .catch(error => {
                        return RES.resMessage(res, error, 500);
                    })
            } else {
                return RES.responseNoPermission(res, "No permission to get orther conversation'info.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
};

module.exports.create = function(req, res, next) {
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
                );
                newConversation.valid_dates = form.member_ids.map(x => {
                    null;
                })
            }

            newConversation.member_ids.push(profile._id);
            newConversation.valid_dates.push(null);

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
};

module.exports.update = function(req, res, next) {
    const id = req.params.conversationId;
    const form = req.body;
    const user_data = req.userData;

    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            let index = profile.conversation_ids.indexOf(id);
            if (index > -1) {
                Conversation.findOne({ _id: id })
                    .exec()
                    .then(conversation => {
                        let index1 = conversation.member_ids.indexOf(profile._id);
                        let valid_date = conversation.valid_dates[index1];
                        if (valid_date == null) {
                            let added = [];
                            if (form.name.trim() != "") {
                                conversation.name = form.name.trim();
                            }
                            if (form.member_ids) {
                                if (form.member_ids.length > 0) {
                                    let count = 0;
                                    for (item in form.member_ids) {
                                        let index = conversation.member_ids.indexOf(item);
                                        if (index >= 0) {
                                            conversation.valid_dates[count] = new Date.now();
                                        } else {
                                            conversation.menber_ids.push(mongoose.Types.ObjectId(item));
                                            conversation.valid_dates.push(null);
                                            added.push(mongoose.Types.ObjectId(item));
                                        }
                                        count++;
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
                        } else {
                            return RES.responseNoPermission(res, "You are already out this group.");
                        }
                    })
                    .catch(error => {
                        return RES.resMessage(res, error, 500);
                    })
            } else {
                return RES.responseNoPermission(res, "No permission to change orther group chat.");
            }
        })
        .catch(errorr => {
            return RES.resMessage(res, errorr, 500);
        })
};

module.exports.delete = function(req, res, next) {

}