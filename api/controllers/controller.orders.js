const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

module.exports.getAllOrder = function(req, res, next) {
    Order.find()
        .select('_id userId productId quantity')
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    message: 'GET all orders.',
                    count: result.length,
                    orders: result
                })
            } else {
                res.status(200).json({
                    message: "GET all orders.",
                    orders: 'NOT have any order yet.'
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

module.exports.getOrderDetail = function(req, res, next) {
    let id = req.params.orderId;
    Order.findOne({ _id: id })
        .select('_id userId productId quantity')
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'Order details',
                    order: result
                })
            } else {
                result.status(200).json({
                    message: 'Have no order with input ID.'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
}

module.exports.createOrder = function(req, res, next) {

    const order = {
        userId: req.body.userId,
        productId: req.body.productId,
        quantity: req.body.quantity || 1,
    }

    User.findOne({ _id: order.userId })
        .exec()
        .then(user => {
            if (user) {
                Product.find({ _id: order.productId })
                    .exec()
                    .then(product => {
                        if (product.length > 0) {
                            const newOrder = new Order(order);
                            newOrder.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(200).json({
                                        message: "Order was created.",
                                        createdOrder: order,
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    })
                                })
                        } else {
                            res.status(404).json({
                                message: "Order was not created.",
                                error: "Product Invalid."
                            })
                        }
                    })
                    .catch(erro => {
                        console.log(erro);
                        res.status(500).json({
                            error: erro
                        })
                    })
            } else {
                res.status(404).json({
                    message: "Order was not created.",
                    error: "User Invalid."
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

module.exports.updateOrder = function(req, res, next) {
    let id = req.params.orderId;
    let updateorder = {
        userId: req.body.userId,
        productId: req.body.productId,
        quantity: req.body.quantity || 1,
    }


    Order.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                User.findOne({ _id: updateorder.userId })
                    .exec()
                    .then(user => {
                        if (user) {
                            Product.findOne({ _id: updateorder.productId })
                                .exec()
                                .then(product => {
                                    if (product) {
                                        //update order here
                                        Order.updateOne({ _id: id }, { $set: updateorder })
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
                                        res.status(404).json({
                                            message: "Order was not created.",
                                            error: "Product Invalid."
                                        })
                                    }
                                })
                                .catch(erro => {
                                    console.log(erro);
                                    res.status(500).json({
                                        error: erro
                                    })
                                })
                        } else {
                            res.status(404).json({
                                message: "Order was not created.",
                                error: "User Invalid."
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({
                            error: error
                        })
                    })
            } else {
                res.status(200).json({
                    message: "order not updated",
                    order: "no have order with input Id"
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

module.exports.deleteOrder = function(req, res, next) {
    let id = req.params.orderId;
    Order.find({ _id: id })
        .exec()
        .then(result => {
            if (result.length > 0) {
                Order.remove({ _id: id })
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
                    message: "No order Deleted.",
                    error: 'NO order with in put ID.'
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