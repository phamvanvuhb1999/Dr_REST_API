const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    email: {
        type: String,
        require: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    }
})


const user = mongoose.model('user', userSchema);
module.exports = user;