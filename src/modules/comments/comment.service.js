const Comment = require("@/modules/comments/comment.model")

const CommentService = {
  createComment: async (commentData) => {
    return Comment.create(commentData)
  }
}

module.exports = CommentService
