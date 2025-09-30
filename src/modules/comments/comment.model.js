const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true })

commentSchema.index({ postId: 1, createdAt: -1 })

commentSchema.post('save', async function (doc, next) {
  await mongoose.model('Post').findByIdAndUpdate(doc.postId, { $inc: { commentsCount: 1 } });
  next();
});

commentSchema.post('remove', async function (doc, next) {
  await mongoose.model('Post').findByIdAndUpdate(doc.postId, { $inc: { commentsCount: -1 } });
  next();
});

commentSchema.methods.toggleLike = async function (userId) {
  const index = this.likes.findIndex(id => id.toString() === userId.toString());
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  await this.save();
  return this;
};

commentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
