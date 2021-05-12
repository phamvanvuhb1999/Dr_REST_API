const express = require('express')
const router = express.Router();

const about = require('../controllers/controller.abouts');
const controller = require('../controllers/controller.profiles');

const tokerMiddleware = require('../middlewares/check.token');

const RES = require('../routes/response');
const upload = RES.getUpload('uploads/avatars', 5, /jpeg|png|jpg/);

//about
router.get('/about', about.profiles);

//get all profiles
router.get('/', tokerMiddleware, controller.getAll);

//get single profile
router.get('/:profileId', tokerMiddleware, controller.getSingle);

//create a profile
router.post('/', tokerMiddleware, controller.create);

//update profile
router.patch('/friends', tokerMiddleware, controller.updateFriends);

//update conversation
router.patch('/conversations/', tokerMiddleware, controller.updateConversations);

//udpate information
router.patch('/informations/', upload.single('avatar'), tokerMiddleware, controller.updateInformation);

//delete profile
router.delete('/:profile', tokerMiddleware, controller.delete);

module.exports = router;