const express = require('express')
const router = express.Router();

const commentController = require('../controllers/controller.comments');

const tokenMiddleware = require('../middlewares/check.token');
const permissionMiddleware = require('../middlewares/check.permission.admin');

const RES = require('./response');
const about = require('../controllers/controller.abouts');

const upload = RES.getUpload("uploads/comments", 5);

//about
router.get('/about', about.comments);

//get all comments from specific user profile
router.get('/:profileId', tokenMiddleware, commentController.getAllWithProfile);

//get all comments from specific post
router.get('/:postId', tokenMiddleware, commentController.getAllWithPost);

//get all comments from specific conversation
router.get('/:conversationId', tokenMiddleware, commentController.getAllWithConversation);

//get all comments
router.get('/', tokenMiddleware, permissionMiddleware, commentController.getAll);

//get single comment
router.get('/:commentId', tokenMiddleware, commentController.getSingle);

//create comment
router.post('/', upload.single('attached'), tokenMiddleware, commentController.create);

//udpate comment
router.patch('/:commentId', upload.single('attached'), tokenMiddleware, commentController.update);

//delete comment
router.delete('/:commentId', tokenMiddleware, commentController.delete);


module.exports = router;