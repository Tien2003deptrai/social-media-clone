const Post = require("@/modules/posts/post.model");

const PostService = {

  createPost: async (postData) => {
    return await Post.create(postData)
  },

  getPosts: async (filter, options) => {

  },

}

module.exports = PostService;
