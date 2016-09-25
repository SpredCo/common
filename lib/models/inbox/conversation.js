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
            messageReadModel.createNew(user, cMsg, user.toString() === from.toString(), function (err, cMsgRead) {
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
            messageReadModel.createNew(user, cMsg, user === from.toString(), function (err, cMsgRead) {
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
    conversationModel.findOne({_id: id, members: user}).populate('members').exec(function (err, fConversation) {
      if (err) {
        cb(err);
      } else if (fConversation == null) {
        cb(null, null);
      } else {
        getConversationMessages(user, fConversation, function (err, messages) {
          if (err) {
            cb(err);
          } else {
            var nMbr;
            var convMbr = [];
            fConversation.members.forEach(function (mbr) {
              nMbr = mbr.toObject({ print: true });
              nMbr.following = undefined;
              convMbr.push(nMbr);
            });
            cb(null, {
              id: fConversation._id,
              object: fConversation.object,
              members: convMbr,
              can_answer: fConversation.canAnswer,
              last_msg: fConversation.lastMsg,
              msg: messages
            });
          }
        })
      }
    });
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
          getConversationMessages(user, conv, function (err, msgs) {
            if (err) {
              cb(err, null);
            } else {
              result.push({
                id: conv._id,
                object: conv.object,
                members: convMbr,
                can_answer: conv.canAnswer,
                last_msg: conv.lastMsg,
                msg: msgs
              });
              if (i === fConversations.length - 1) {
                cb(null, result);
              }
            }
          });
        });
      }
    }
  });
};

function getConversationMessages(user, conversation, cb) {
  messageModel.getByConversation(conversation, function (err, fMessages) {
    if (err) {
      cb(err);
    } else if (fMessages.length === 0) {
      cb(null, []);
    } else {
      var messages = [];
      fMessages.forEach(function (msg, i) {
        getMessageRead(user, msg, function (err, read) {
          if (err) {
            cb(err);
          } else {
            messages.push({
              id: msg._id,
              from: msg.from,
              created_at: msg.createdAt,
              content: msg.content,
              read: read
            });
            if (i === fMessages.length - 1) {
              cb(null, messages);
            }
          }
        });
      });
    }
  });
}

function getMessageRead(user, message, cb) {
  messageReadModel.getByUserMessage(user, message._id, function (err, fRead) {
    if (err) {
      cb(err);
    } else {
      cb(null, fRead.read);
    }
  });
}

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
