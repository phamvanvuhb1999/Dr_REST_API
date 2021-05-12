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
    },
    bufferCommands: false,
    autoCreate: false
})

const Post = mongoose.model('Post', postSchema);
const connect = async function() {
    await Post.createCollection().catch(error => {
        console.log(error);
    })
}
connect()
module.exports = Post;