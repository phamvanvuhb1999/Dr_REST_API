const express = require('express')
const router = express.Router();

const userController = require('../controllers/controller.users');

const tokenMiddleware = require('../middlewares/check.token');
const permissionMiddleware = require('../middlewares/check.permission.admin');


router.post('/signup', userController.signup);

router.post('/login', userController.login);

//get all users
router.get('/', tokenMiddleware, permissionMiddleware, userController.getAllUser);

//get single user
router.get('/:userId', tokenMiddleware, permissionMiddleware, userController.getUserDetail);

//udpate user
router.patch('/:userId', tokenMiddleware, permissionMiddleware, userController.updateUser);

//delete user
router.delete('/:userId', tokenMiddleware, permissionMiddleware, userController.deleteUser);



module.exports = router;