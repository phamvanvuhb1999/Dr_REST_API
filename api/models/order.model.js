const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true },
    quantity: { type: Number, min: 1, require: true },
    bufferCommands: false,
    autoCreate: false
})


const Order = mongoose.model('Order', orderSchema);
const connect = async function() {
    await Order.createCollection();
}
module.exports = Order;
connect().then(result => {
    console.log("Create collection orders successed.");
}).catch(error => {
    console.log("Create collection failed.");
})