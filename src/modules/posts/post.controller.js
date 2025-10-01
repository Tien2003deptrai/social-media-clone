const PostService = require("@/modules/posts/post.service");

const PostController = {
  createPost: async (req, res, next) => {
    const postData = req.body;
    const post = await PostService.createPost(postData);
    res.json(ok(post, { message: "Post created successfully" }));
  },
}

module.exports = PostController;
