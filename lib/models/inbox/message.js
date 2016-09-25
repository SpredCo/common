const mongoose = require('mongoose');

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

messageSchema.statics.getByConversation = function (conversation, cb) {
  messageModel.find({ conversation: conversation }).populate('from').sort('createdAt').exec(cb);
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