const express = require('express')
const router = express.Router();

const tokerMiddleware = require('../middlewares/check.token');
const adminPermission = require('../middlewares/check.permission.admin');

const postController = require('../controllers/controller.posts');
const about = require('../controllers/controller.abouts');

const RES = require('./response');

const upload = RES.getUpload("uploads/posts", 20, /jpeg|png|jpg/);

//about
router.get('/about', about.posts);

//get all posts
router.get('/', postController.getAll);

//get single post
router.get('/:postId', tokerMiddleware, postController.getSingle);

//get all post from specific user
router.get('/profileId/:profileId', tokerMiddleware, postController.getWithProfile);

//create a post
router.post('/', upload.single('attached'), tokerMiddleware, postController.create);

//update post
router.patch('/:postId', upload.single('attached'), tokerMiddleware, postController.update);

//delete post
router.delete('/:postId', tokerMiddleware, postController.delete);

module.exports = router;