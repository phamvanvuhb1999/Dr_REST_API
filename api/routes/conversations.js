const express = require('express')
const router = express.Router();

const tokenMiddleware = require('../middlewares/check.token');
const permissionMiddleware = require('../middlewares/check.permission.admin');

const about = require('../controllers/controller.abouts');
const controller = require('../controllers/controller.conversations');

//about
router.get('/about', about.conversations);

//get all conversations 
router.get('/', tokenMiddleware, permissionMiddleware, controller.getAll);

//get all conversation from specific profile
router.get('/:profileId', tokenMiddleware, controller.getWithProfile);

//get single conversation
router.get('/:conversationId', tokenMiddleware, controller.getSingle);

//create conversation
router.post('/', tokenMiddleware, controller.create);

//update conversation
router.patch('/:conversationId', tokenMiddleware, controller.update);

//delete conversation
router.delete('/:conversationId', tokenMiddleware, controller.delete);


module.exports = router;