const express = require('express')
const router = express.Router();

const userController = require('../controllers/controller.users');

const tokenMiddleware = require('../middlewares/check.token');
const permitionMiddleware = require('../middlewares/check.permition.admin');


router.post('/signup', userController.signup);

router.post('/login', userController.login);

//get all users
router.get('/', tokenMiddleware, permitionMiddleware, userController.getAllUser);

//get single user
router.get('/:userId', tokenMiddleware, permitionMiddleware, userController.getUserDetail);

//udpate user
router.patch('/:userId', tokenMiddleware, permitionMiddleware, userController.updateUser);

//delete user
router.delete('/:userId', tokenMiddleware, permitionMiddleware, userController.deleteUser);



module.exports = router;