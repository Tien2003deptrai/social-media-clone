const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['like', 'comment', 'follow']
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  }
}, { timestamps: true })

notificationSchema.index({ userId: 1, createdAt: -1 })

notificationSchema.methods.markAsRead = function () {
  this.read = true;
  return this.save();
};

notificationSchema.statics.markAsRead = function (userId) {
  return this.updateMany({ userId, read: false }, { $set: { read: true } });
};

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification
