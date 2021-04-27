const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true },
    quantity: { type: Number, min: 1, require: true },
})


const order = mongoose.model('Order', orderSchema);
module.exports = order;