const mongoose = require('mongoose')
const CommentSchema = mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        require: true
    },
    creat_at: { type: Date, default: Date.now },
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        require: true,
    },
    content: { type: String, default: " " },
    attached: { type: String, require: true },
})


const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;