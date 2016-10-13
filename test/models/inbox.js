const common = require('../../');
const expect = require('chai').expect;
const fixture = require('../fixture/models/inbox.json');

var user1;
var user2;
var user3;
var conv;
var msg;

describe('Testing inbox models', function () {
  before(function (done) {
    common.userModel.createPassword(fixture.user1.email, fixture.user1.password, fixture.user1.pseudo, fixture.user1.firstName, fixture.user1.lastName, function (err, cUser1) {
      if (err) {
        done(err);
      } else {
        common.userModel.createPassword(fixture.user2.email, fixture.user2.password, fixture.user2.pseudo, fixture.user2.firstName, fixture.user2.lastName, function (err, cUser2) {
          if (err) {
            done(err);
          } else {
            common.userModel.createPassword(fixture.user3.email, fixture.user3.password, fixture.user3.pseudo, fixture.user3.firstName, fixture.user3.lastName, function (err, cUser3) {
              if (err) {
                done(err);
              } else {
                user1 = cUser1;
                user2 = cUser2;
                user3 = cUser3;
                done();
              }
            });
          }
        });
      }
    });
  });

  it('conversationModel.sendNewMessage()', function (done) {
    common.conversationModel.sendNewMessage(fixture.object1, [user1, user2, user3], true, user1, fixture.content1, function (err, cConv, cMsg) {
      if (err) {
        done(err);
      } else {
        expect(cConv).to.not.be.undefined;
        expect(cConv.object).to.equal(fixture.object1);
        expect(cConv.canAnswer).to.be.true;
        expect(cConv.lastMsg).to.not.be.undefined;
        expect(cConv.members).to.has.lengthOf(3);
        expect(cMsg.content).to.equal(fixture.content1);
        expect(cMsg.from.pseudo).to.equal(user1.pseudo);
        done();
      }
    });
  });

  it('conversationModel.sendNewMessage()', function (done) {
    common.conversationModel.sendNewMessage(fixture.object2, [user1, user2, user3], true, user1, fixture.content1, function (err, cConv, cMsg) {
      if (err) {
        done(err);
      } else {
        expect(cConv).to.not.be.undefined;
        expect(cConv.object).to.equal(fixture.object2);
        expect(cConv.canAnswer).to.be.true;
        expect(cConv.lastMsg).to.not.be.undefined;
        expect(cConv.members).to.has.lengthOf(3);
        expect(cMsg.content).to.equal(fixture.content1);
        expect(cMsg.from.pseudo).to.equal(user1.pseudo);
        conv = cConv;
        done();
      }
    });
  });

  it('conversation.createNewMessage()', function (done) {
    conv.sendNewMessage(user2, fixture.content2, function (err, cMsg) {
      if (err) {
        done(err);
      } else {
        expect(cMsg.from.pseudo).to.equal(fixture.user2.pseudo);
        expect(cMsg.content).to.equal(fixture.content2);
        msg = cMsg;
        done();
      }
    });
  });

  it('conversation.createNewMessage()', function (done) {
    conv.sendNewMessage(user2, fixture.content3, function (err, cMsg) {
      if (err) {
        done(err);
      } else {
        expect(cMsg.from.pseudo).to.equal(fixture.user2.pseudo);
        expect(cMsg.content).to.equal(fixture.content3);
        done();
      }
    });
  });

  it('conversation.getUserConversations()', function (done) {
    common.conversationModel.getUserConversations(user2, function (err, fConversation) {
      if (err) {
        done(err);
      } else {
        expect(fConversation).to.be.an.array;
        expect(fConversation).to.have.lengthOf(2);
        expect(fConversation[0].read).to.be.false;
        expect(fConversation[0].object).to.equal(fixture.object2);
        expect(fConversation[1].read).to.be.false;
        expect(fConversation[1].object).to.equal(fixture.object1);
        done();
      }
    });
  });

  it('messageRead.updateRead()', function (done) {
    common.messageReadModel.updateRead(user3, msg, true, function (err) {
      if (err) {
        done(err);
      } else {
        common.messageReadModel.getByUserMessage(user3, msg._id, function (err, fMsg) {
          if (err) {
            done(err);
          } else {
            expect(fMsg).to.not.be.null;
            expect(fMsg.read).to.be.true;
            done();
          }
        });
      }
    });
  });

  it('messageRead.getUnreadCount()', function (done) {
    common.messageReadModel.getUnreadCount(user1, function (err, result) {
      if (err) {
        done(err);
      } else {
        expect(result).to.equal(2);
        done();
      }
    });
  });

  it('messageRead.updateReadConversation()', function (done) {
    common.messageReadModel.updateReadConversation(user1.id, conv.id, true, function (err) {
      if (err) {
        done(err);
      } else {
        common.messageReadModel.getUnreadCount(user1, function (err, result) {
          if (err) {
            done(err);
          } else {
            expect(result).to.equal(0);
            done();
          }
        });
      }
    });
  });

  it('conversationModel.getById()', function (done) {
    common.conversationModel.getById(conv.id, function (err, fConv) {
      if (err) {
        done(err);
      } else {
        expect(fConv.object).to.equal(fixture.object2);
        done();
      }
    });
  });

  it('conversationModel.getByIdAndUser()', function (done) {
    common.conversationModel.getByIdAndUser(conv.id, user1, function (err, fConv) {
      if (err) {
        done(err);
      } else {
        expect(fConv.object).to.equal(fixture.object2);
        expect(fConv.msg).to.have.lengthOf(3);
        expect(fConv.msg[0].content).to.equal(fixture.content3);
        expect(fConv.msg[1].content).to.equal(fixture.content2);
        expect(fConv.msg[2].content).to.equal(fixture.content1);
        expect(fConv.msg[0].read).to.be.true;
        done();
      }
    });
  });

  it('conversationModel.getByIdAndUser()', function (done) {
    common.conversationModel.getByIdAndUser(conv.id, user3, function (err, fConv) {
      if (err) {
        done(err);
      } else {
        expect(fConv.object).to.equal(fixture.object2);
        expect(fConv.msg).to.have.lengthOf(3);
        expect(fConv.msg[0].content).to.equal(fixture.content3);
        expect(fConv.msg[1].content).to.equal(fixture.content2);
        expect(fConv.msg[2].content).to.equal(fixture.content1);
        expect(fConv.msg[0].read).to.be.false;
        done();
      }
    });
  });

  it('conversationModel.getByIdAndUser()', function (done) {
    common.conversationModel.getByIdAndUser('aaaaaaaaaaaa', user1, function (err, fConv) {
      if (err) {
        done(err);
      } else {
        expect(fConv).to.be.null;
        done();
      }
    });
  });

  it('conversation.toObject()', function () {
    var result = conv.toObject({ print: true });
    expect(result.id).to.not.be.undefined;
    expect(result._id).to.be.undefined;
    expect(result.__v).to.be.undefined;
    expect(result.updatedAt).to.be.undefined;
  });

  it('messageModel.getConversationAndId()', function (done) {
    common.messageModel.getByConversationAndId(conv.id, msg.id, function (err, fMsg) {
      if (err) {
        done(err);
      } else {
        expect(fMsg.content).to.equal(msg.content);
        done();
      }
    });
  });

  it('messageModel.getByIdWithRead()', function (done) {
    common.messageModel.getByIdWithRead(msg.id, user2, function (err, fMsg) {
      if (err) {
        done(err);
      } else {
        expect(fMsg.content).to.equal(fixture.content2);
        expect(fMsg.read).to.be.true;
        done();
      }
    });
  });

  it('message.toObject()', function () {
    var result = msg.toObject({ print: true });
    expect(result.id).to.not.be.undefined;
    expect(result._id).to.be.undefined;
    expect(result.__v).to.be.undefined;
    expect(result.updatedAt).to.be.undefined;
  });
});
