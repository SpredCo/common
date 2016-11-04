const common = require('../../index');
const expect = require('chai').expect;
const fixture = require('../fixture/models/spredcast.json');

var client;
var user;
var user2;
var user3;
var cast1;
var cast2;
var token;

describe('Testing Spredcast models', function () {
  before(function (done) {
    common.userModel.createPassword(fixture.user.email, fixture.user.password, fixture.user.pseudo, '', '', function (err, cUser) {
      if (err) {
        done(err);
      } else {
        common.userModel.createPassword(fixture.user2.email, fixture.user2.password, fixture.user2.pseudo, '', '', function (err, cUser2) {
          if (err) {
            done(err);
          } else {
            common.userModel.createPassword(fixture.user3.email, fixture.user3.password, fixture.user3.pseudo, '', '', function (err, cUser3) {
              if (err) {
                done(err);
              } else {
                common.clientModel.createFix(fixture.client.name, fixture.client.key, fixture.client.secret, function (err, cClient) {
                  if (err) {
                    done(err);
                  } else {
                    client = cClient;
                    user = cUser;
                    user2 = cUser2;
                    user3 = cUser3;
                    done();
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  describe('spredCastModel.createNew()', function () {
    it('Should create a public cast', function (done) {
      common.spredCastModel.createNew(user, fixture.cast.name, fixture.cast.description, fixture.cast.tags, fixture.cast.date, fixture.cast.isPublic, fixture.cast.userCapacity, null, fixture.cast.duration, function (err, cCast) {
        if (err) {
          done(err);
        } else {
          expect(cCast).to.not.be.null;
          expect(cCast._id).to.not.be.null;
          expect(cCast.name).to.equal(fixture.cast.name);
          expect(cCast.description).to.equal(fixture.cast.description);
          cast1 = cCast;
          done();
        }
      });
    });

    it('Should create a private cast', function (done) {
      common.spredCastModel.createNew(user, fixture.cast2.name, fixture.cast2.description, fixture.cast2.tags, fixture.cast2.date, fixture.cast2.isPublic, fixture.cast2.userCapacity, [ user2 ], fixture.cast2.duration, function (err, cCast) {
        if (err) {
          done(err);
        } else {
          expect(cCast).to.not.be.null;
          expect(cCast._id).to.not.be.null;
          expect(cCast.name).to.equal(fixture.cast2.name);
          expect(cCast.description).to.equal(fixture.cast2.description);
          expect(cCast.members).to.have.lengthOf(1);
          cast2 = cCast;
          done();
        }
      });
    });
  });

  describe('spredCastModel.getById()', function () {
    it('Should retrieve the good cast', function (done) {
      common.spredCastModel.getById(cast1._id, function (err, fCast) {
        if (err) {
          done(err);
        } else {
          expect(fCast).to.not.be.null;
          expect(fCast.name).to.equal(fixture.cast.name);
          done();
        }
      });
    });
  });

  describe('spredCastModel.userCanJoin()', function () {
    it('Should authorize only caster when stream is not started', function (done) {
      common.spredCastModel.userCanJoin(cast1._id, user._id, true, function (err, authorisation, fCast) {
        if (err) {
          done(err);
        } else {
          expect(authorisation).to.be.true;
          done();
        }
      });
    });
    it('Should authorize only caster when stream is not started', function (done) {
      common.spredCastModel.userCanJoin(cast1._id, user2._id, false, function (err, authorisation, fCast) {
        if (err) {
          done(err);
        } else {
          expect(authorisation).to.be.false;
          done();
        }
      });
    });
  });

  describe('spredCastModel.updateState()', function () {
    it('Should update state of the spredCast', function (done) {
      common.spredCastModel.updateState(cast1._id, 1, function (err) {
        if (err) {
          done(err);
        } else {
          common.spredCastModel.getById(cast1._id, function (err, fCast) {
            if (err) {
              done(err);
            } else {
              expect(fCast.state).to.equal(1);
              done();
            }
          });
        }
      });
    });

    it('Should update state of the spredCast', function (done) {
      common.spredCastModel.updateState(cast2._id, 1, function (err) {
        if (err) {
          done(err);
        } else {
          common.spredCastModel.getById(cast2._id, function (err, fCast) {
            if (err) {
              done(err);
            } else {
              expect(fCast.state).to.equal(1);
              done();
            }
          });
        }
      });
    });

    it('Sould now allow user2 to access cast1', function (done) {
      common.spredCastModel.userCanJoin(cast1._id, user2._id, false, function (err, authorisation, fCast) {
        if (err) {
          done(err);
        } else {
          expect(authorisation).to.be.true;
          done();
        }
      });
    });

    it('Sould now allow user2 to access cast2', function (done) {
      common.spredCastModel.userCanJoin(cast2._id, user2._id, false, function (err, authorisation, fCast) {
        if (err) {
          done(err);
        } else {
          expect(authorisation).to.be.true;
          done();
        }
      });
    });

    it('Sould not allow user3 to access cast12', function (done) {
      common.spredCastModel.userCanJoin(cast2._id, user3._id, false, function (err, authorisation, fCast) {
        if (err) {
          done(err);
        } else {
          expect(authorisation).to.be.false;
          done();
        }
      });
    });
  });

  describe('spredCastModel.updateUserCount()', function () {
    it('Should update the user count number', function (done) {
      common.spredCastModel.updateUserCount(cast1._id, 2, function (err) {
        if (err) {
          done(err);
        } else {
          common.spredCastModel.getById(cast1._id, function (err, fCast) {
            if (err) {
              done(err);
            } else {
              expect(fCast.userCount).to.equal(2);
              done();
            }
          });
        }
      });
    });
  });

  describe('castTokenModel.createNew()', function () {
    it('Should create a new cast token with an existing user', function (done) {
      common.castTokenModel.createNew(client, user, cast1, true, function (err, cToken) {
        if (err) {
          done(err);
        } else {
          expect(cToken.pseudo).to.equal(user.pseudo);
          token = cToken;
          done();
        }
      });
    });

    it('Should create a new cast token with an anonymous user', function (done) {
      common.castTokenModel.createNew(client, null, cast1, true, function (err, cToken) {
        if (err) {
          done(err);
        } else {
          expect(cToken.pseudo).to.not.be.undefined;
          done();
        }
      });
    });
  });

  describe('castTokenModel.getByToken()', function () {
    it('Should find the created token', function (done) {
      common.castTokenModel.getByToken(token.token, function (err, fToken) {
        if (err) {
          done(err);
        } else {
          expect(fToken._id.toString()).to.equal(token._id.toString());
          expect(fToken.user.pseudo).to.equal(user.pseudo);
          expect(fToken.cast.name).to.equal(cast1.name);
          done();
        }
      });
    });
  });

  describe('castTokenModel.revokeCast()', function () {
    it('Should remove all token generate for cast1', function (done) {
      common.castTokenModel.revokeCast(cast1._id, function (err) {
        if (err) {
          done(err);
        } else {
          common.castTokenModel.getByToken(token.token, function (err, fToken) {
            if (err) {
              done(err);
            } else {
              expect(fToken).to.be.null;
              done();
            }
          });
        }
      });
    });
  });
});
