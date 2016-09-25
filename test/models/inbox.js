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

  it('conversationModel.getByUser()', function (done) {
    common.conversationModel.getByUser(user1, function (err, fConversations) {
      if (err) {
        done(err);
      } else {
        expect(fConversations).to.has.lengthOf(0);
        done();
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

  it('messageRead.updateRead()', function (done) {
    common.messageReadModel.updateRead(user3, msg, true, function (err) {
      if (err) {
        done(err);
      } else {
        common.conversationModel.getByUser(user3, function (err, fConversations) {
          if (err) {
            done(err);
          } else {
            expect(fConversations).to.has.lengthOf(1);
            expect(fConversations[0].msg).to.has.lengthOf(2);
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
        expect(fConv.object).to.equal(fixture.object1);
        done();
      }
    });
  });

  it('conversationModel.getByIdAndUser()', function (done) {
    common.conversationModel.getByIdAndUser(conv.id, user1, function (err, fConv) {
      if (err) {
        done(err);
      } else {
        expect(fConv.object).to.equal(fixture.object1);
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
        expect(fMsg.read).to.be.false;
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
