const express = require('express')
const router = express.Router();

const productController = require('../controllers/controller.products');

const checkAuth = require('../middlewares/check.token');
const checkPermition = require('../middlewares/check.permition.admin');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/productImages');
    },
    filename: function(req, file, cb) {
        let newFileName = new Date().toISOString().replace(':', '-');
        newFileName += file.originalname;
        newFileName = newFileName.replace(':', '-');
        cb(null, newFileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


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