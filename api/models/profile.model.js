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
            ref: 'Profile'
        }],
        validate: [maxFriendList]
    },
    conversation_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation'
        }]
    },
    bufferCommands: false,
    autoCreate: false
})

function maxFriendList(value) {
    return value.length < 5000;
}


const profile = mongoose.model('Profile', ProfileSchema);
const connect = async function() {
    await profile.createCollection();
}
module.exports = profile;
connect().then(result => {
    console.log("Create collection profiles successed.");
    module.exports = profile;
}).catch(error => {
    console.log("Create collection failed.");
})