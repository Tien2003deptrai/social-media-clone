const router = require("express").Router();
const { authMiddleware } = require("@/core/middlewares");
const CommentController = require("@/modules/comments/comment.controller");

router.post("/addComment", authMiddleware, CommentController.createComment);

module.exports = router;
