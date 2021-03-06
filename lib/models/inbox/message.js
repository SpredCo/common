const mongoose = require('mongoose');
const messageReadModel = require('./messageRead');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'conversation',
    required: true
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: String
}, { timestamps: true });

messageSchema.statics.createNew = function (conversation, from, content, cb) {
  messageModel.create({
    conversation: conversation,
    from: from,
    content: content
  }, cb);
};

messageSchema.statics.getByIdWithRead = function (id, user, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(null, null);
  } else {
    messageModel.findOne({ _id: id }, function (err, fMsg) {
      if (err) {
        cb(err);
      } else if (fMsg == null) {
        cb(null, null);
      } else {
        var result = fMsg.toObject({ print: true });
        messageReadModel.getByUserMessage(user, fMsg._id, function (err, fRead) {
          if (err) {
            cb(err);
          } else {
            result.read = fRead.read;
            cb(null, result);
          }
        });
      }
    });
  }
};

messageSchema.statics.getByConversation = function (conversation, cb) {
  messageModel.find({ conversation: conversation }).sort('createdAt').exec(cb);
};

messageSchema.statics.getByConversationAndId = function (conversationId, id, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(null, null);
  } else {
    messageModel.findOne({ _id: id, conversation: conversationId }, cb);
  }
};

if (!messageSchema.options.toObject) messageSchema.options.toObject = {};
messageSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.print) {
    ret.id = ret._id;
    ret._id = undefined;
    ret.__v = undefined;
    ret.updatedAt = undefined;
  }
  return ret;
};

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
