const mongoose = require('mongoose');
const messageModel = require('./message');
const messageReadModel = require('./messageRead');

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  object: {
    type: String,
    required: true
  },
  members: [ {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  canAnswer: Boolean,
  lastMsg: {
    type: Date,
    required: true
  }
}, { timestamps: true });

conversationSchema.statics.createNew = function (object, members, canAnswer, cb) {
  conversationModel.create({
    object: object,
    members: members,
    canAnswer: canAnswer,
    lastMsg: new Date()
  }, cb);
};

conversationSchema.statics.sendNewMessage = function (object, members, canAnswer, from, content, cb) {
  conversationModel.createNew(object, members, canAnswer, function (err, cConversation) {
    if (err) {
      cb(err);
    } else {
      messageModel.createNew(cConversation, from, content, function (err, cMsg) {
        if (err) {
          cb(err);
        } else {
          members.forEach(function (user, i) {
            messageReadModel.createNew(user, cConversation, cMsg, user.toString() === from.toString(), function (err, cMsgRead) {
              if (err) {
                cb(err);
              } else {
                if (i === members.length - 1) {
                  cb(null, cConversation, cMsg);
                }
              }
            });
          });
        }
      });
    }
  });
};

conversationSchema.methods.sendNewMessage = function (from, content, cb) {
  const conv = this;
  conv.lastMsg = new Date();
  conv.save(function (err) {
    if (err) {
      cb(err);
    } else {
      messageModel.createNew(conv, from, content, function (err, cMsg) {
        if (err) {
          cb(err);
        } else {
          conv.members.forEach(function (user, i) {
            messageReadModel.createNew(user, conv, cMsg, user.toString() === from.toString(), function (err, cMsgRead) {
              if (err) {
                cb(err);
              } else {
                if (i === conv.members.length - 1) {
                  cb(null, cMsg);
                }
              }
            });
          });
        }
      });
    }
  });
};

conversationSchema.statics.getById = function (id, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(null, null);
  } else {
    conversationModel.findOne({ _id: id }, cb);
  }
};

conversationSchema.statics.getUserConversations = function (user, cb) {
  conversationModel.find({ members: user }).populate('members').sort('-lastMsg').exec(function (err, fConversations) {
    if (err) {
      cb(err);
    } else {
      var conversations = [];
      fConversations.forEach(function (elem) {
        conversations.push({
          id: elem._id,
          created_at: elem.createdAt,
          object: elem.object,
          can_answer: elem.canAnswer,
          last_msg: elem.lastMsg,
          members: elem.members.map(function (mbr) {
            var nMbr = mbr.toObject({ print: true });
            nMbr.following = undefined;
            return nMbr;
          }),
          read: true
        });
      });
      messageReadModel.getByConversationsAndUser(fConversations, user, false, function (err, fReads) {
        if (err) {
          cb(err);
        } else {
          fReads.forEach(function (fRead) {
            conversations.find(function (conv) { return conv.id.toString() === fRead.conversation.toString(); }).read = false;
          });
          cb(null, conversations);
        }
      });
    }
  });
};

conversationSchema.statics.getByIdAndUser = function (id, user, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(null, null);
  } else {
    conversationModel.findOne({_id: id, members: user}).populate('members').exec(function (err, fConversation) {
      if (err) {
        cb(err);
      } else if (fConversation == null) {
        cb(null, null);
      } else {
        messageModel.getByConversation(fConversation, function (err, fMessages) {
          if (err) {
            cb(err);
          } else {
            messageReadModel.getByConversationsAndUser(fConversation, user, false, function (err, fReads) {
              if (err) {
                cb(err);
              } else {
                var conversation = {
                  id: fConversation._id,
                  created_at: fConversation.createdAt,
                  object: fConversation.object,
                  can_answer: fConversation.canAnswer,
                  last_msg: fConversation.lastMsg,
                  members: fConversation.members.map(function (mbr) {
                    var nMbr = mbr.toObject({ print: true });
                    nMbr.following = undefined;
                    return nMbr;
                  }),
                  msg: []
                };
                fMessages.forEach(function (fMsg) {
                  conversation.msg.push({
                    id: fMsg._id,
                    from: fMsg.from,
                    created_at: fMsg.createdAt,
                    content: fMsg.content,
                    read: true
                  });
                });
                fReads.forEach(function (fRead) {
                  conversation.msg.find(function (msg) { return msg.id.toString() === fRead.message.toString(); }).read = false;
                });
                cb(null, conversation);
              }
            });
          }
        });
      }
    });
  }
};

if (!conversationSchema.options.toObject) conversationSchema.options.toObject = {};
conversationSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.print) {
    ret.id = ret._id;
    ret._id = undefined;
    ret.__v = undefined;
    ret.updatedAt = undefined;
  }
  return ret;
};

const conversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = conversationModel;
