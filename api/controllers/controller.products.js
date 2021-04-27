const Product = require('../models/product.model');



module.exports.getAllProduct = function(req, res, next) {
    Product.find()
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    message: "GET all products ",
                    count: result.length,
                    products: result.map(doc => {
                        return {
                            id: doc._id,
                            name: doc.name,
                            price: doc.price,
                            image: doc.image,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:' + process.env.PORT + '/products/' + doc.id
                            }
                        }
                    })
                })
            } else {
                res.status(200).json({
                    message: 'GET all products',
                    products: 'products table is empty'
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        })
}

module.exports.getProductDetail = function(req, res, next) {
    let id = req.params.productId;
    Product.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    message: "Product detail",
                    Product: result
                })
            } else {
                res.status(200).json({
                    message: "Product detail",
                    Product: "no have product with input Id"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: error
            });
        })
}

module.exports.updateProduct = function(req, res, next) {
    let id = req.params.productId;

    Product.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                let updateProduct = {
                    name: req.body.name || result.name,
                    price: req.body.price || result.price,
                    image: req.body.image || result.image,
                };

                //another way update product
                // const updateOps = {};
                // for(const ops of req.body){
                //     updateOps[ops.propName] = ops.value;
                // }


                Product.updateOne({ _id: id }, { $set: updateProduct })
                    .exec()
                    .then(result => {
                        res.status(200).json(result)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(205).json({
                            error: err
                        })
                    })
            } else {
                res.status(200).json({
                    message: "Product not updated",
                    Product: "no have product with input Id"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}

module.exports.deleteProduct = function(req, res, next) {
    let id = req.params.productId;
    Product.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                Product.remove({ _id: id })
                    .exec()
                    .then(result1 => {
                        res.status(200).json(result1)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        });
                    })
            } else {
                res.status(205).json({
                    message: "No product Deleted.",
                    error: 'NO product with in put ID.'
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        })
}

module.exports.createProduct = function(req, res, next) {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.file.path,
        description: req.body.description || "",
    })

    product.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Handling POST request to /products",
                createdProduct: product,
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: error
            });
        })
}