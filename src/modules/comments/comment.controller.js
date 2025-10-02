const CommentService = require("@/modules/comments/comment.service");
const { ok } = require("@uniresp/core");
const { asyncRoute } = require("@uniresp/server-express");

const CommentController = {
  createComment: asyncRoute(async (req, res, next) => {
    const commentData = { ...req.body, userId: req.user.userId };
    const result = await CommentService.createComment(commentData);
    return res.json(ok(result, { message: "Post created successfully" }));
  }),
}

module.exports = CommentController
