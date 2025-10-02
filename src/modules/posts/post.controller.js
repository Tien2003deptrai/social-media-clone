const PostService = require("./post.service");
const { asyncRoute } = require("@uniresp/server-express");
const { ok } = require("@uniresp/core");

const PostController = {
  createPost: asyncRoute(async (req, res, next) => {
    const postData = { ...req.body, userId: req.user.id };
    const result = await PostService.createPost(postData);
    return res.json(ok(result, { message: "Post created successfully" }));
  }),

  getPosts: asyncRoute(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.body;
    const result = await PostService.getPosts(page, limit);
    return res.json(ok(result, { message: "Posts retrieved successfully" }));
  }),
};

module.exports = PostController;
