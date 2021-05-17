module.exports.comments = function(req, res, next) {
    res.status(200).json({
        "get all comments": { "url": "/", "method": "GET", "permission": "token && admin" },
        "get all comments from specific user": { "url": "/:profileId", "method": "GET", "permission": "self || admin" },
        "get all comments from specific post": { "url": "/:postId", "method": "GET", "permission": "token" },
        "get all comments from specific conversation": { "url": "/:conversationId", "method": "GET", "permission": "token && in group" },
        "get single comment": { "url": "/:commentId", "method": "GET", "permission": "token" },
        "create comment": { "url": "/", "method": "POST", "permission": "token", "body": "content || attached" },
        "update comment": { "url": "/:commentId", "method": "PATCH", "permission": "self", "body": "content || attached" },
        "delete comment": { "url": "/commentId", "method": "DELETE", "permission": "self" }
    });
}

module.exports.posts = function(req, res, next) {
    res.status(200).json({
        "get all posts": { "url": "/", "method": "GET", "permission": "admin" },
        "get all posts from specific user": { "url": "profileId/:profileId", "method": "GET", "permission": "self || admin" },
        "get single post": { "url": "/:postId", "method": "GET", "permission": "in group" },
        "create post": { "url": "/", "method": "POST", "permission": "self", "body": "content || attached" },
        "update post": { "url": "/:postId", "method": "PATCH", "permission": "in group", "body": "content || attached" },
        "delete post": { "url": "/postId", "method": "DELETE", "permission": "self" }
    });
};

module.exports.conversations = function(req, res, next) {
    res.status(200).json({
        "get all conversations": { "url": "/", "method": "GET", "permission": "token && admin" },
        "get all conversations from specific user": { "url": "/:profileId", "method": "GET", "permission": "self || admin" },
        "get single conversation": { "url": "/:conversationId", "method": "GET", "permission": "token && in group" },
        "create conversation": { "url": "/", "method": "POST", "permission": "token", "body": "content || attached" },
        "update conversation": { "url": "/:conversationId", "method": "PATCH", "permission": "token && in group", "body": "content || attached" },
        "delete conversation": { "url": "/conversationId", "method": "DELETE", "permission": "token && self" }
    });
};

module.exports.profiles = function(req, res, next) {
    res.status(200).json({
        "get all profiles": { "url": "/", "method": "GET", "permission": "admin" },
        "get single profile": { "url": "/:profileId", "method": "GET", "permission": "token" },
        "update profile": { "url": "/", "method": "PATCH", "permission": "in group", "body": "fullname || avatar" },
        "update profile": { "url": "/friends", "method": "PATCH", "permission": "self", "body": "friends" },
        "update profile": { "url": "/conversation_ids", "method": "PATCH", "permission": "self", "body": "conversation_ids" },
    });
}