const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    creat_at: { type: Date, default: Date.now },
    content: { type: String, require: false },
    attached: {
        type: String,
        require: false
    },
    comment_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    },
})


const Post = mongoose.model('Post', postSchema);
module.exports = Post;