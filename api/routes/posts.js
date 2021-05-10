const express = require('express')
const router = express.Router();

const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const User = require('../models/user.model');

const RES = require('./response');

//const postController = require('../controllers/controller.posts');


//get all posts
router.get('/', function(req, res, next) {

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
router.get('/:postId', function(req, res, next) {
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
router.get('/:profileId', function(req, res, next) {
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
                return RES.responseNoPermition(res, "No permition to get all Post from other user.");
            }
        })
        .catch(error => {
            return RES.resMessage(res, error, 500);
        })
});

//create a post
router.post('/', function(req, res, next) {
    const user_data = req.userData;
    const content = req.body.content;
    const attached = req.body.attached;
    if (content || attached) {
        const post = {};
        post.author_id = user_data.userId;
        if (content) {
            post.content = content;
        }
        if (attached) {
            post.attached = attached;
        }
        const newPost = new Post(post);
        newPost.save()
            .then(result => {
                return RES.responseNormal(res, result, "Post was Created.");
            })
            .catch(error => {
                return RES.resMessage(res, error, 500);
            })
    } else {
        return RES.responseNormal(res, null, "Post create invalid.");
    }
    const post = new Post({ content: form.content, attached: form.attached })
});

//update post
router.patch('/:postId', function(req, res, next) {
    const postId = req.params.postId;
    const user_data = req.userData;
    const content = req.body.content;
    const attached = req.body.attached;

    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            let updatePost = {};
            if (content) {
                updatePost.content = content;
            }
            if (attached) {
                updatePost.attached = attached;
            }
            Post.deleteOne({ _id: postId })
                .exec()
                .then(post => {
                    if (post) {
                        if (profile._id == post.author_id) {
                            Post.updateOne({ _id: postId }, { $set: updatePost })
                                .exec()
                                .then(result => {
                                    return RES.responseNormal(res, result, "Post was updated.");
                                })
                                .catch(err => {
                                    return RES.resMessage(res, err, 500);
                                })
                        } else {
                            return RES.responseNoPermition(res, "No permition to update other user's post.");
                        }
                    } else {
                        return RES.resMessage(res, null, 500);
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
router.delete('/:postId', function(req, res, next) {
    const user_data = req.userData;
    const postId = req.params.postId;
    Profile.findOne({ userId: user_data.userId })
        .exec()
        .then(profile => {
            Post.deleteOne({ _id: postId })
                .exec()
                .then(post => {
                    if (post) {
                        if (profile._id == post.author_id) {
                            Post.deleteOne({ _id: postId })
                                .exec()
                                .then(result => {
                                    return RES.responseNormal(res, result, "Post was deleted.");
                                })
                                .catch(err => {
                                    return RES.resMessage(res, err, 500);
                                })
                        } else {
                            return RES.responseNoPermition(res, "No permition to delete other user's post.");
                        }
                    } else {
                        return RES.resMessage(res, null, 500);
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