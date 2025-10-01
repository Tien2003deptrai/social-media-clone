const router = require("express").Router();
const PostController = require("@/modules/posts/post.controller");
const { authMiddleware } = require("@/core/middlewares");

router.post("/", authMiddleware, PostController.createPost);

module.exports = router;
