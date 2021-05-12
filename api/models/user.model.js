const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    email: {
        type: String,
        require: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    sessionToken: { type: String, default: null },
    isStaff: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    bufferCommands: false,
    autoCreate: false
})


const User = mongoose.model('User', userSchema);
const connect = async function() {
    await User.createCollection();
}
connect()
module.exports = User;