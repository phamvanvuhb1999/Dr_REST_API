const mongoose = require('mongoose')
const ProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    fullname: { type: String, require: true },
    avatar: { type: String, require: false },
    is_block: { type: Boolean, default: false },
    updated_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    create_at: { type: Date, default: Date.now },
    friends: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            validate: [maxFriendList, "{PATH} max friends in listFriend"],
        }],
    },
    conversation_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation'
        }]
    }
})

function maxFriendList(listFriend) {
    return listFriend.length < 5000;
}


const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;