const express = require('express')
const router = express.Router();

const orderController = require('../controllers/controller.orders');


//get all orders
router.get('/', orderController.getAllOrder);

//create a order
router.post('/', orderController.createOrder);

//get single order
router.get('/:orderId', orderController.getOrderDetail);

//update order
router.patch('/:orderId', orderController.updateOrder);

//delete order
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;