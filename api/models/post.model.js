const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        require: true
    },
    creat_at: { type: Date, default: Date.now },
    content: { type: String, default: "" },
    attached: {
        type: String,
        require: false
    },
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        require: true,
    }
})


const Post = mongoose.model('Post', postSchema);
module.exports = Post;