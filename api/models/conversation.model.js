const mongoose = require('mongoose')
const ConversationSchema = mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    creat_at: { type: Date, default: Date.now },
    name: { type: String, require: true },
    nember_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        require: true,
        validate: [
            minMembers, "{PATH} at least one in the conversation"
        ],
    }
})


function minMembers(value) {
    return value.length > 0;
}


const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;