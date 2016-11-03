const common = require('../../index');
const expect = require('chai').expect;
const fixture = require('../fixture/models/spredcast.json');

var client;
var user;
var user2;
var user3;
var cast1;
var cast2;

describe('Testing Spredcast models', function () {
  before(function (done) {
    common.userModel.createPassword(fixture.user.email, fixture.user.password, fixture.user.pseudo, "", "", function (err, cUser) {
      if (err) {
        done(err);
      } else {
        common.userModel.createPassword(fixture.user2.email, fixture.user2.password, fixture.user2.pseudo, "", "", function (err, cUser2) {
          if (err) {
            done(err);
          } else {
            common.userModel.createPassword(fixture.user3.email, fixture.user3.password, fixture.user3.pseudo, "", "", function (err, cUser3) {
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
      common.spredCastModel.userCanJoin(cast1._id, user._id, function (err, authorisation, fCast) {
        if (err) {
          done(err);
        } else {
          expect(authorisation).to.be.true;
          done();
        }
      });
    });
    it('Should authorize only caster when stream is not started', function (done) {
      common.spredCastModel.userCanJoin(cast1._id, user2._id, function (err, authorisation, fCast) {
        if (err) {
          done(err);
        } else {
          expect(authorisation).to.be.false;
          done();
        }
      });
    });
  });
});
