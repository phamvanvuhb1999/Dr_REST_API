const Profile = require('../models/profile.model');

const mongoose = require('mongoose');

const RES = require('../routes/response');

module.exports.getAll = function(req, res, next) {
    Profile.find({})
        .exec()
        .then(profiles => {
            if (profiles.length > 0) {
                return RES.responseNormal(res, profiles, "All profile from application.");
            } else {
                return RES.responseDataEmpty(res, "No Porfile was Created.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.getSingle = function(req, res, next) {
    const profileId = req.params.profileId;
    Profile.find({ _id: profileId })
        .exec()
        .then(profile => {
            return RES.responseNormal(res, profile, "Post Detail.")
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
};

module.exports.updateFriends = function(req, res, next) {
    const user_data = req.userData;
    var updateFriends = req.body.friends;

    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            var friends = JSON.parse(JSON.stringify(profile.friends));

            for (let i = 0; i < updateFriends.length; i++) {
                let item = mongoose.Types.ObjectId(updateFriends[i]);
                let index = friends.indexOf(updateFriends[i]);
                if (index >= 0) {
                    friends.splice(index, 1);
                } else {
                    var id = mongoose.Types.ObjectId(item);
                    friends.push(id);
                    console.log(i + 3)
                }
            }
            profile.friends = friends;
            profile.save()
                .then(result => {
                    return RES.responseNormal(res, result, "profile was updated.");
                })
                .catch(erro => {
                    return RES.resMessage(res, erro, 500);
                })
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.updateConversations = function(req, res, next) {
    const user_data = req.userData;
    const updateConversations = req.body.conversations;

    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            let currentUserConversations = JSON.parse(JSON.stringify(profile.conversation_ids));
            for (conver in updateConversations) {
                let index = currentUserConversations.indexOf(conver);
                if (index >= 0) {
                    currentUserConversations.splice(index, 1);
                } else {
                    currentUserConversations.push(mongoose.Types.ObjectId(conver));
                }
            }

            profile.conversation_ids = currentUserConversations;
            profile.save()
                .then(result => {
                    return RES.responseNormal(res, result, "Profile was updated at conversation_ids.");
                })
                .catch(erro => {
                    return RES.resMessage(res, erro, 500);
                });
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
};

module.exports.updateInformation = function(req, res, next) {
    const form = req.body;
    const user_data = req.userData;
    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            let flag = false;
            if (form.fullname && form.fullname.trim() != "") {
                profile.fullname = form.fullname.trim();
                console.log(form.fullname);
                flag = true;
            }
            if (form.avatar && form.avatar.trim() != "") {
                profile.avatar = form.avatar.trim();
                flag = true;
            } else if (req.file) {
                profile.avatar = req.file.path;
                flag = true;
            }
            if (form.is_block != undefined && form.is_block) {
                profile.is_block = Boolean(form.is_block);
                flag = true;
            }

            if (flag) {
                profile.save()
                    .then(result => {
                        return RES.responseNormal(res, result, "Profile was updated at information.");
                    })
                    .catch(erro => {
                        return RES.resMessage(res, erro, 500);
                    })
            } else {
                return RES.responseNormal(res, profile, "That the same information.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
}

module.exports.delete = function(req, res, next) {

};

module.exports.create = function(req, res, next) {

}