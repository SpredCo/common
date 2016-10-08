const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageReadSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'conversation',
    required: true
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: 'message',
    required: true
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  }
});

messageReadSchema.statics.createNew = function (user, conversation, message, read, cb) {
  messageReadModel.create({
    user: user,
    conversation: conversation,
    message: message,
    read: read
  }, cb);
};

messageReadSchema.statics.getByUserMessage = function (user, message, cb) {
  if (!mongoose.Types.ObjectId.isValid(message)) {
    cb(null, null);
  } else {
    messageReadModel.findOne({user: user, message: message}, cb);
  }
};

messageReadSchema.statics.updateReadConversation = function (user, conversation, read, cb) {
  messageReadModel.update({ user: user, conversation: conversation, read: !read }, { read: read }, cb);
};

messageReadSchema.statics.updateRead = function (user, message, read, cb) {
  messageReadModel.findOneAndUpdate({ user: user, message: message }, { read: read }, cb);
};

messageReadSchema.statics.getUnreadCount = function (user, cb) {
  messageReadModel.count({ user: user, read: false }, cb);
};

const messageReadModel = mongoose.model('messageRead', messageReadSchema);

module.exports = messageReadModel;
