const Post = require("@/modules/posts/post.model");

const PostService = {

  createPost: async (postData) => {
    return await Post.create(postData)
  },

  getPosts: async (page, limit) => {
    const skip = (page - 1) * limit;

    const data = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'comments',
          let: { postId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$postId', '$$postId'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' }
          ],
          as: 'comments'
        }
      },
      {
        $project: {
          'user.password': 0,
          'user.__v': 0,
          'comments.user': 0
        }
      }
    ])

    const total = await Post.countDocuments();

    return {
      page: Number(page),
      limit: Number(limit),
      total,
      data
    }
  },

}

module.exports = PostService;
