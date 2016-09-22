const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageReadSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
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

messageReadSchema.statics.createNew = function (user, message, read, cb) {
  messageReadModel.create({
    user: user,
    message: message,
    read: read
  }, cb);
};

messageReadSchema.statics.getByUserMessage = function (user, message, cb) {
  messageReadModel.findOne({ user: user, message: message }, cb);
};

messageReadSchema.statics.updateRead = function (user, message, read, cb) {
  messageReadModel.findOneAndUpdate({ user: user, message: message }, { read: read }, cb);
};

const messageReadModel = mongoose.model('messageRead', messageReadSchema);

module.exports = messageReadModel;
