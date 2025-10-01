const { paginate } = require('@/modules/plugins');
const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: null
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  mediaUrls: {
    type: [String],
    default: []
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

postSchema.plugin(paginate)

postSchema.index({ userId: 1, createdAt: -1 });

postSchema.pre('save', function (next) {
  if (this.content) {
    this.content = this.content.trim();
  }
  next();
});

postSchema.pre('remove', async function (next) {
  const postId = this._id;
  await mongoose.model('Comment').deleteMany({ postId });
  next();
});

postSchema.methods.toggleLike = async function (userId) {
  const index = this.likes.findIndex(id => id.toString() === userId.toString());
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  await this.save();
  return this;
};

postSchema.methods.incrementComments = async function () {
  this.commentsCount += 1;
  await this.save();
};

postSchema.methods.decrementComments = async function () {
  if (this.commentsCount > 0) {
    this.commentsCount -= 1;
    await this.save();
  }
};

postSchema.statics.findByUser = function (userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

const Post = mongoose.model('Post', postSchema)

module.exports = Post
