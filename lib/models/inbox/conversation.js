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
            messageReadModel.createNew(user, cMsg, user === from, function (err, cMsgRead) {
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
            messageReadModel.createNew(user, cMsg, user === from, function (err, cMsgRead) {
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

conversationSchema.statics.getByIdAndUser = function (id, user, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(null, null);
  } else {
    conversationModel.findOne({_id: id, members: user}, cb);
  }
};

conversationSchema.statics.getByUser = function (user, cb) {
  conversationModel.find({ members: user }).populate('members').sort('lastMsg').exec(function (err, fConversations) {
    if (err) {
      cb(err);
    } else {
      if (fConversations.length === 0) {
        cb(null, []);
      } else {
        var result = [];
        fConversations.forEach(function (conv, i) {
          var nMbr;
          var convMbr = [];
          conv.members.forEach(function (mbr) {
            nMbr = mbr.toObject({ print: true });
            nMbr.following = undefined;
            convMbr.push(nMbr);
          });
          var convResult = {
            object: conv.object,
            members: convMbr,
            can_answer: conv.canAnswer,
            last_msg: conv.lastMsg,
            msg: []
          };
          messageModel.getByConversation(conv, function (err, fMsgs) {
            if (err) {
              cb(err);
            } else {
              fMsgs.forEach(function (msg, j) {
                var msgResult = {
                  from: msg.from.toObject({print: true}),
                  content: msg.content,
                  created_at: msg.createdAt,
                  read: false
                };
                messageReadModel.getByUserMessage(user, msg, function (err, fRead) {
                  if (err) {
                    cb(err);
                  } else if (fRead == null) {
                    cb(true);
                  } else {
                    msgResult.read = fRead.read;
                    convResult.msg.push(msgResult);
                    if (j === fMsgs.length - 1) {
                      result.push(convResult);
                      if (i === fConversations.length - 1) {
                        cb(null, result);
                      }
                    }
                  }
                });
              });
            }
          });
        });
      }
    }
  });
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
