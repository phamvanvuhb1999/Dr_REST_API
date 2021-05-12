const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    //_id: mongoose.Types.ObjectId,
    name: { type: String, default: "", require: true },
    price: { type: Number, min: 0 },
    image: { type: String, require },
    description: { type: String, default: "" },
    bufferCommands: false,
    autoCreate: false
})


const product = mongoose.model('Product', productSchema);
const connect = async function() {
    await product.createCollection().catch(error => {
        console.log(error);
    })
}
connect()
module.exports = product;