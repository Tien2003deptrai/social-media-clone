const PostService = require("@/modules/posts/post.service");
const { ok } = require('@uniresp/core')
const { ValidationError } = require('@uniresp/errors')
const { asyncRoute } = require('@uniresp/server-express')

const PostController = {
  createPost: asyncRoute(async (req, res, next) => {
    const userId = req.user?.userId
    if (!userId) throw new ValidationError('User not authenticated', { field: 'userId' })

    const post = await PostService.createPost({ ...req.body, userId })
    return res.json(ok(post, { message: "Post created successfully" }))
  }),
}

module.exports = PostController;
