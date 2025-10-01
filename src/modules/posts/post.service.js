const Post = require("@/modules/posts/post.model");

const PostService = {

  createPost: async (postData) => {
    const post = await Post.create(postData);
    return post;
  },

}

module.exports = PostService;
