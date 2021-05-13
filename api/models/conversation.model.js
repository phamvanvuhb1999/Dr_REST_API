const mongoose = require('mongoose')
const ConversationSchema = mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        require: true
    },
    creat_at: { type: Date, default: Date.now },
    name: { type: String, require: true },
    in_post: { type: Boolean, default: false },
    member_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
        }],
        require: true,
        validate: [
            minMembers, "{PATH} at least one in the conversation"
        ],
    },
    valid_dates: [
        { type: mongoose.Schema.Types.Date, default: null },
    ],
    bufferCommands: false,
    autoCreate: false
})


function minMembers(value) {
    return value.length > 0;
}


const Conversation = mongoose.model('Conversation', ConversationSchema);
const connect = async function() {
    await Conversation.createCollection();
}
module.exports = Conversation;
connect().then(result => {
    console.log("Create collection conversations successed.");
}).catch(error => {
    console.log("Create collection failed.");
})