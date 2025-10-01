const Post = require("@/modules/posts/post.model");

const PostService = {

  createPost: async (postData) => {
    return await Post.create(postData)
  },

}

module.exports = PostService;
