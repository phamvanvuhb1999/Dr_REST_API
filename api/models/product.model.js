const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    //_id: mongoose.Types.ObjectId,
    name: { type: String, default: "", require: true },
    price: { type: Number, min: 0 },
    image: { type: String, require },
    description: { type: String, default: "" }
})


const Product = mongoose.model('Product', productSchema);
module.exports = Product;