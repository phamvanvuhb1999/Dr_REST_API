const express = require('express')
const router = express.Router();

const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const User = require('../models/user.model');

const RES = require('./response');

const tokerMiddleware = require('../middlewares/check.token');

//const postController = require('../controllers/controller.posts');


//get all posts
router.get('/', tokerMiddleware, function(req, res, next) {

    //update permittions here

    const user_data = req.userData;
    Post.find({})
        .exec()
        .then(posts => {
            if (posts.length > 0) {
                return RES.responseNormal(res, posts, "All post from application.");
            } else {
                return RES.responseDataEmpty(res, "No Post was Created.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//get single post
router.get('/:postId', tokerMiddleware, function(req, res, next) {
    const postId = req.params.postId;
    Post.find({ _id: postId })
        .exec()
        .then(post => {
            return RES.responseNormal(res, post, "Post Detail.")
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//get all post from specific user
router.get('/:profileId', tokerMiddleware, function(req, res, next) {
    const profileId = req.params.profileId;
    const user_data = req.userData;
    Profile.findOne({ _id: profileId })
        .exec()
        .then(profile => {
            if (profile.userId == user_data.userId) {
                Post.find({ author_id: profile._id })
                    .exec()
                    .then(posts => {
                        if (posts.length > 0) {
                            return RES.responseNormal(res, posts, "All posts from user.");
                        } else {
                            return RES.responseDataEmpty(res, "Have no post from user.");
                        }
                    })
                    .catch(erro => {
                        return RES.resMessage(res, erro, 500);
                    })
            } else {
                return RES.responseNoPermission(res, "No permission to get all Post from other user.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//create a post
router.post('/', tokerMiddleware, function(req, res, next) {
    const user_data = req.userData;
    const content = req.body.content;
    const attached = req.body.attached;
    if (content || attached) {
        const post = {};
        if (content) {
            post.content = content;
        }
        if (attached) {
            post.attached = attached;
        }

        Profile.findOne({ userId: user_data.userId })
            .exec()
            .then(profile => {
                post.author_id = profile._id;
                const newPost = new Post(post);
                newPost.save()
                    .then(result => {
                        return RES.responseNormal(res, result, "Post was Created.");
                    })
                    .catch(error => {
                        return RES.resMessage(res, error, 500);
                    })
            })
            .catch(error => {
                return RES.resMessage(res, error, 500);
            })
    } else {
        return RES.responseNormal(res, null, "Post create invalid.");
    }
});

//update post
router.patch('/:postId', tokerMiddleware, function(req, res, next) {
    const postId = req.params.postId;
    const user_data = req.userData;
    const content = req.body.content;
    const attached = req.body.attached;

    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            Post.findOne({ _id: postId })
                .exec()
                .then(post => {
                    console.log("Profile id: " + profile.id + " Post author: " + post.author_id);
                    if (profile._id + "" == post.author_id) {
                        let flag = false;
                        if (content) {
                            post.content = content;
                            flag = true;
                        }
                        if (attached) {
                            post.attached = attached;
                            flag = true
                        }
                        if (flag) {
                            post.save()
                                .then(result => {
                                    return RES.responseNormal(res, result, "Post was updated.");
                                })
                                .catch(err => {
                                    return RES.resMessage(res, err, 500);
                                })
                        } else {
                            return RES.responseNormal(res, result, "Post was updated.");
                        }

                    } else {
                        return RES.responseNoPermission(res, "No permission to update other user's post.");
                    }
                })
                .catch(erro => {
                    return RES.resMessage(res, erro, 500);
                })
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//delete post
router.delete('/:postId', tokerMiddleware, function(req, res, next) {
    const user_data = req.userData;
    const postId = req.params.postId;
    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            Post.findOne({ _id: postId })
                .exec()
                .then(post => {
                    if (profile._id + "" == post.author_id) {
                        Post.deleteOne({ _id: postId })
                            .exec()
                            .then(result => {
                                return RES.responseNormal(res, result, "Post was deleted.");
                            })
                            .catch(erro => {
                                console.log(erro);
                                return RES.resMessage(res, erro, 500);
                            })
                    } else {
                        return RES.responseNoPermission(res, "Have no permission to delele orther people's post.");
                    }
                })
                .catch(erro => {
                    return RES.resMessage(res, erro, 500);
                })
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

module.exports = router;