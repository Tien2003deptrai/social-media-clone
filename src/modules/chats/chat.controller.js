// {
//   _id: ObjectId,
//   participants: [ObjectId],  // userIds
//   lastMessage: {
//     senderId: ObjectId,
//     content: String,
//     createdAt: Date
//   },
//   updatedAt: Date
// }
const mongoose = require('mongoose')

const lastMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      default: '',
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  lastMessage: {
    type: lastMessageSchema,
    default: null,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  unreadCounts: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true })

chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

chatSchema.statics.findPrivateChat = function (userA, userB) {
  return this.findOne({
    participants: { $all: [userA, userB], $size: 2 },
    isGroup: false,
  });
};

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat;
