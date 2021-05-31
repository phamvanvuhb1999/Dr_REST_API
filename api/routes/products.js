const express = require('express')
const router = express.Router();

const productController = require('../controllers/controller.products');

const checkAuth = require('../middlewares/check.token');
const checkPermission = require('../middlewares/check.permission.admin');

const RES = require('../routes/response');
const upload = RES.getUpload('uploads/avatars', 5, /jpeg|png|jpg/);
///*************** */


//get all products
router.get('/', checkAuth, productController.getAllProduct);

router.post('/', checkAuth, upload.single('productImage'), productController.createProduct);

//get single product
router.get('/:productId', checkAuth, productController.getProductDetail);

//udpate product
router.patch('/:productId', checkAuth, productController.updateProduct);

//delete product
router.delete('/:productId', checkAuth, productController.deleteProduct);



module.exports = router;