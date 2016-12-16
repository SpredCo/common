const common = require('../../index');
const expect = require('chai').expect;
const fixture = require('../fixture/models/spredcast.json');

var client;
var user;
var user2;
var user3;
var tag1;
var tag2;
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

  describe('Testing TagModel', function () {
    describe('tag.createNew()', function () {
      it('Should create a new tag', function (done) {
        common.tagModel.createNew(fixture.tag1.name, fixture.tag1.description, function (err, cTag1) {
          if (err) {
            done(err);
          } else {
            common.tagModel.createNew(fixture.tag2.name, fixture.tag2.description, function (err, cTag2) {
              if (err) {
                done(err);
              } else {
                expect(cTag1.name).to.equal(fixture.tag1.name);
                expect(cTag1.description).to.equal(fixture.tag1.description);
                expect(cTag2.name).to.equal(fixture.tag2.name);
                expect(cTag2.description).to.equal(fixture.tag2.description);
                tag1 = cTag1;
                tag2 = cTag2;
                done();
              }
            });
          }
        });
      });
    });

    describe('tag.getAll()', function () {
      it('Should return all created tags', function (done) {
        common.tagModel.getAll(function (err, fTags) {
          if (err) {
            done(err);
          } else {
            expect(fTags).to.have.lengthOf(2);
            done();
          }
        });
      });
    });

    describe('tag.getByName()', function () {
      it('Should return the right tag', function (done) {
        common.tagModel.getByName(tag1.name, function (err, fTag) {
          if (err) {
            done(err);
          } else {
            expect(fTag).to.not.be.null;
            done();
          }
        });
      });

      it('Should return null if no tags are found', function (done) {
        common.tagModel.getByName('toto', function (err, fTag) {
          if (err) {
            done(err);
          } else {
            expect(fTag).to.be.null;
            done();
          }
        });
      });
    });

    describe('tag.search()', function () {
      it('Should return the matched tag', function (done) {
        common.tagModel.search('co', 10, function (err, fTags) {
          if (err) {
            done(err);
          } else {
            expect(fTags).to.have.lengthOf(1);
            done();
          }
        });
      });

      it('Should return emty array if no tags are matched', function (done) {
        common.tagModel.search('p', 10, function (err, fTags) {
          if (err) {
            done(err);
          } else {
            expect(fTags).to.have.lengthOf(0);
            done();
          }
        });
      });
    });

    describe('tagModel.checkExist()', function () {
      it('Should return true if all tags exists', function (done) {
        common.tagModel.checkExist([tag1._id, tag2._id], function (err, result) {
          if (err) {
            done(err);
          } else {
            expect(result).to.be.true;
            done();
          }
        });
      });

      it('Should return false if a tag does not exist', function (done) {
        common.tagModel.checkExist([tag1._id, 'abcd'], function (err, result) {
          if (err) {
            done(err);
          } else {
            expect(result).to.be.false;
            done();
          }
        });
      });

      it('Should return false if a tag does not exist', function (done) {
        common.tagModel.checkExist([tag1._id, '584d63188c0add434feccabb'], function (err, result) {
          if (err) {
            done(err);
          } else {
            expect(result).to.be.false;
            done();
          }
        });
      });
    });
  });

  describe('Testing spredCastModel', function () {
    describe('spredCastModel.createNew()', function () {
      it('Should create a public cast', function (done) {
        common.spredCastModel.createNew(user, fixture.cast.name, fixture.cast.description, [tag1, tag2], fixture.cast.date, fixture.cast.isPublic, fixture.cast.userCapacity, null, fixture.cast.duration, fixture.cast.url, fixture.cast.coverUrl, function (err, cCast) {
          if (err) {
            done(err);
          } else {
            expect(cCast).to.not.be.null;
            expect(cCast._id).to.not.be.null;
            expect(cCast.name).to.equal(fixture.cast.name);
            expect(cCast.url).to.equal(fixture.cast.url);
            expect(cCast.description).to.equal(fixture.cast.description);
            expect(cCast.coverUrl).to.equal(fixture.cast.coverUrl);
            cast1 = cCast;
            done();
          }
        });
      });

      it('Should create a private cast', function (done) {
        common.spredCastModel.createNew(user, fixture.cast2.name, fixture.cast2.description, [tag1, tag2], fixture.cast2.date, fixture.cast2.isPublic, fixture.cast2.userCapacity, [ user2 ], fixture.cast2.duration, fixture.cast2.url, fixture.cast2.coverUrl, function (err, cCast) {
          if (err) {
            done(err);
          } else {
            expect(cCast).to.not.be.null;
            expect(cCast._id).to.not.be.null;
            expect(cCast.name).to.equal(fixture.cast2.name);
            expect(cCast.url).to.equal(fixture.cast2.url);
            expect(cCast.description).to.equal(fixture.cast2.description);
            expect(cCast.members).to.have.lengthOf(1);
            expect(cCast.coverUrl).to.equal(fixture.cast2.coverUrl);
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
        common.spredCastModel.userCanJoin(cast1._id, user._id, function (err, authorisation, presenter, fCast) {
          if (err) {
            done(err);
          } else {
            expect(authorisation).to.be.true;
            expect(presenter).to.be.true;
            done();
          }
        });
      });
      it('Should authorize only caster when stream is not started', function (done) {
        common.spredCastModel.userCanJoin(cast1._id, user2._id, function (err, authorisation, presenter, fCast) {
          if (err) {
            done(err);
          } else {
            expect(authorisation).to.be.false;
            expect(presenter).to.be.false;
            done();
          }
        });
      });
    });

    describe('spredCastModel.getByUrl()', function () {
      it('Should find the researched cast', function (done) {
        common.spredCastModel.getByUrl(fixture.cast.url, function (err, fCast) {
          if (err) {
            done(err);
          } else {
            expect(fCast.name).to.equal(fixture.cast.name);
            done();
          }
        });
      });
    });

    describe('spredCastModel.getByUser()', function () {
      it('Should find the user s cast', function (done) {
        common.spredCastModel.getByUser(user._id, function (err, fCasts) {
          if (err) {
            done(err);
          } else {
            expect(fCasts).to.have.lengthOf(2);
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

      it('Should now allow user2 to access cast1', function (done) {
        common.spredCastModel.userCanJoin(cast1._id, user2._id, function (err, authorisation, presenter, fCast) {
          if (err) {
            done(err);
          } else {
            expect(authorisation).to.be.true;
            expect(presenter).to.be.false;
            done();
          }
        });
      });

      it('Should now allow guest to access cast1', function (done) {
        common.spredCastModel.userCanJoin(cast1._id, null, function (err, authorisation, presenter, fCast) {
          if (err) {
            done(err);
          } else {
            expect(authorisation).to.be.true;
            expect(presenter).to.be.false;
            done();
          }
        });
      });

      it('Should now allow user2 to access cast2', function (done) {
        common.spredCastModel.userCanJoin(cast2._id, user2._id, function (err, authorisation, presenter, fCast) {
          if (err) {
            done(err);
          } else {
            expect(authorisation).to.be.true;
            expect(presenter).to.be.false;
            done();
          }
        });
      });

      it('Should not allow user3 to access cast2', function (done) {
        common.spredCastModel.userCanJoin(cast2._id, user3._id, function (err, authorisation, presenter, fCast) {
          if (err) {
            done(err);
          } else {
            expect(authorisation).to.be.false;
            expect(presenter).to.be.false;
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

    describe('spredCastModel.toObject()', function () {
      it('Should return a clean spredcast object', function (done) {
        common.spredCastModel.findOne({ _id: cast1._id }).populate('members creator').exec(function (err, fCast) {
          if (err) {
            done(err);
          } else {
            var ret = fCast.toObject({ print: true });
            expect(ret._id).to.be.undefined;
            expect(ret.id).to.not.be.undefined;
            expect(ret.userCapacity).to.be.undefined;
            expect(ret.userCount).to.be.undefined;
            expect(ret.isPublic).to.be.undefined;
            expect(ret.user_capacity).to.not.be.undefined;
            expect(ret.user_count).to.not.be.undefined;
            expect(ret.is_public).to.not.be.undefined;
            expect(ret.cover_url).to.not.be.undefined;
            expect(ret.tags[0]._id).to.be.undefined;
            expect(ret.tags[0].id).to.not.be.undefined;
            done();
          }
        });
      });

      it('Should return a clean spredcast object', function (done) {
        common.spredCastModel.findOne({ _id: cast2._id }).populate('members creator').exec(function (err, fCast) {
          if (err) {
            done(err);
          } else {
            var ret = fCast.toObject({ print: true });
            expect(ret._id).to.be.undefined;
            expect(ret.id).to.not.be.undefined;
            expect(ret.userCapacity).to.be.undefined;
            expect(ret.userCount).to.be.undefined;
            expect(ret.isPublic).to.be.undefined;
            expect(ret.user_capacity).to.not.be.undefined;
            expect(ret.user_count).to.not.be.undefined;
            expect(ret.is_public).to.not.be.undefined;
            expect(ret.cover_url).to.not.be.undefined;
            expect(ret.tags[0]._id).to.be.undefined;
            expect(ret.tags[0].id).to.not.be.undefined;
            done();
          }
        });
      });
    });
  });

  describe('Testing castTokenModel', function () {
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

    describe('spredCastModel.findAvailableCast()', function () {
      it('Should find available cast', function (done) {
        common.spredCastModel.findAvailableCast(function (err, fCast) {
          if (err) {
            done(err);
          } else {
            expect(fCast).has.lengthOf(2);
            done();
          }
        });
      });
    });

    describe('spredCastModel.getByTag()', function () {
      it('Should return a cast array', function (done) {
        common.spredCastModel.getByTag(tag1, function (err, fCasts) {
          if (err) {
            done(err);
          } else {
            expect(fCasts).to.have.lengthOf(2);
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

  describe('Testing spredcastRegitrationModel', function () {
    describe('Testing spredcastReminderModel.createNew()', function () {
      it('Should create a new spredcastRegistration object', function (done) {
        common.spredcastReminderModel.createNew(cast1._id, user._id, function (err, cCastRegistration) {
          if (err) {
            done(err);
          } else {
            expect(cCastRegistration).to.not.be.null;
            done();
          }
        });
      });
    });

    describe('Testing spredcastRegistration.getUserReminder()', function () {
      it('Should return an array of registred cast', function (done) {
        common.spredcastReminderModel.getUserReminder(user._id, function (err, fCastRegistrations) {
          if (err) {
            done(err);
          } else {
            expect(fCastRegistrations).to.have.lengthOf(1);
            expect(fCastRegistrations[0].cast.name).to.equal(cast1.name);
            done();
          }
        });
      });

      it('Should return an array of registred cast', function (done) {
        common.spredcastReminderModel.getUserReminder(user2._id, function (err, fCastRegistrations) {
          if (err) {
            done(err);
          } else {
            expect(fCastRegistrations).to.have.lengthOf(0);
            done();
          }
        });
      });
    });

    describe('Testing spredcastRegistration.getCastReminder()', function () {
      it('Should return the array of user registered to cast', function (done) {
        common.spredcastReminderModel.getCastReminder(cast1._id, function (err, fCastRegistrations) {
          if (err) {
            done(err);
          } else {
            expect(fCastRegistrations).to.have.lengthOf(1);
            expect(fCastRegistrations[0].user.pseudo).to.equal(user.pseudo);
            done();
          }
        });
      });
    });

    describe('Testing spredcastRegistration.userIsReminded()', function () {
      it('Should return true if user is already registered', function (done) {
        common.spredcastReminderModel.userIsReminded(cast1._id, user._id, function (err, result) {
          if (err) {
            done(err);
          } else {
            expect(result).to.be.true;
            done();
          }
        });
      });

      it('Should return false if user is not registered', function (done) {
        common.spredcastReminderModel.userIsReminded(cast1._id, user2._id, function (err, result) {
          if (err) {
            done(err);
          } else {
            expect(result).to.be.false;
            done();
          }
        });
      });
    });

    describe('Testing spredcastRegistration.removeReminder()', function () {
      it('Should deleted the registration object', function (done) {
        common.spredcastReminderModel.removeReminder(cast1._id, user._id, function (err, result) {
          if (err) {
            done(err);
          } else {
            expect(result).to.be.true;
            done();
          }
        });
      });
    });
  });
});
