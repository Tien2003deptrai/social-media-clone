// {
//   _id: ObjectId,
//   senderId: ObjectId,
//   receiverId: ObjectId,
//   content: String,
//   mediaUrl: String,
//   createdAt: Date,
//   readAt: Date
// }
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
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
  mediaUrl: {
    type: String,
    default: null
  },
  readAt: {
    type: Date,
    default: null,
    index: true
  }
}, { timestamps: true })

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 })

messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 })

messageSchema.methods.markAsRead = function () {
  this.readAt = new Date();
  return this.save();
};

messageSchema.statics.markConversationAsRead = function (senderId, receiverId) {
  return this.updateMany(
    { senderId, receiverId, readAt: null },
    { $set: { readAt: new Date() } }
  );
};

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
