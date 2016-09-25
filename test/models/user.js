const common = require('../../');
const expect = require('chai').expect;
const fixture = require('../fixture/models/user.json');

var pUser;
var faUser;
var gUser;

describe('Testing user models', function () {
  describe('Testing user model', function () {
    it('createPassword()', function (done) {
      common.userModel.createPassword(fixture.password.email,
        fixture.password.password,
        fixture.password.pseudo,
        fixture.password.firstName,
        fixture.password.lastName,
        function (err, cUser) {
          if (err) {
            done(err);
          } else {
            expect(cUser.email).to.equal(fixture.password.email);
            expect(cUser.password).to.not.equal(fixture.password.password);
            expect(cUser.pseudo).to.equal(fixture.password.pseudo);
            expect(cUser.firstName).to.equal(fixture.password.firstName);
            expect(cUser.lastName).to.equal(fixture.password.lastName);
            expect(cUser.following).to.be.an.array;
            expect(cUser.following).to.have.lengthOf(0);
            pUser = cUser;
            done();
          }
        });
    });

    it('createFacebook()', function (done) {
      common.userModel.createFacebook(fixture.facebook.email,
        fixture.facebook.facebookId,
        fixture.facebook.pseudo,
        fixture.facebook.firstName,
        fixture.facebook.lastName,
        fixture.facebook.pictureUrl,
        function (err, cUser) {
          if (err) {
            done(err);
          } else {
            expect(cUser.email).to.equal(fixture.facebook.email);
            expect(cUser.facebookId).to.equal(fixture.facebook.facebookId);
            expect(cUser.pseudo).to.equal(fixture.facebook.pseudo);
            expect(cUser.pictureUrl).to.equal(fixture.facebook.pictureUrl);
            expect(cUser.firstName).to.equal(fixture.password.firstName);
            expect(cUser.lastName).to.equal(fixture.password.lastName);
            expect(cUser.following).to.be.an.array;
            expect(cUser.following).to.have.lengthOf(0);
            faUser = cUser;
            done();
          }
        });
    });

    it('createGoogle()', function (done) {
      common.userModel.createGoogle(fixture.google.email,
        fixture.google.googleId,
        fixture.google.pseudo,
        fixture.google.firstName,
        fixture.google.lastName,
        fixture.google.pictureUrl,
        function (err, cUser) {
          if (err) {
            done(err);
          } else {
            expect(cUser.email).to.equal(fixture.google.email);
            expect(cUser.googleId).to.equal(fixture.google.googleId);
            expect(cUser.pseudo).to.equal(fixture.google.pseudo);
            expect(cUser.pictureUrl).to.equal(fixture.google.pictureUrl);
            expect(cUser.firstName).to.equal(fixture.google.firstName);
            expect(cUser.lastName).to.equal(fixture.google.lastName);
            expect(cUser.following).to.be.an.array;
            expect(cUser.following).to.have.lengthOf(0);
            gUser = cUser;
            done();
          }
        });
    });

    it('getByEmail()', function (done) {
      common.userModel.getByEmail(pUser.email, function (err, fUser) {
        if (err) {
          done(err);
        } else {
          expect(fUser).to.not.be.null;
          expect(fUser._id).to.eql(pUser._id);
          done();
        }
      });
    });

    it('getByPartialEmail()', function (done) {
      common.userModel.getByPartialEmail('ma', 10, function (err, fUsers) {
        if (err) {
          done(err);
        } else {
          expect(fUsers).to.have.lengthOf(2);
          done();
        }
      });
    });

    it('getByPartialPseudo()', function (done) {
      common.userModel.getByPartialPseudo('z', 10, function (err, fUsers) {
        if (err) {
          done(err);
        } else {
          expect(fUsers).to.have.lengthOf(2);
          done();
        }
      });
    });

    it('getByCredential()', function (done) {
      common.userModel.getByCredential(pUser.email,
        fixture.password.password,
        function (err, fUser) {
          if (err) {
            done(err);
          } else {
            expect(fUser).to.not.be.false;
            expect(fUser._id).to.eql(pUser._id);
            done();
          }
        });
    });

    it('getByCredential()', function (done) {
      common.userModel.getByCredential(pUser.email,
        'toto',
        function (err, fUser) {
          if (err) {
            done(err);
          } else {
            expect(fUser).to.be.false;
            done();
          }
        });
    });

    it('getByFacebookId()', function (done) {
      common.userModel.getByFacebookId(faUser.facebookId, function (err, fUser) {
        if (err) {
          done(err);
        } else {
          expect(fUser).to.not.be.null;
          expect(fUser._id).to.eql(faUser._id);
          done();
        }
      });
    });

    it('getByGoogleId()', function (done) {
      common.userModel.getByGoogleId(gUser.googleId, function (err, fUser) {
        if (err) {
          done(err);
        } else {
          expect(fUser).to.not.be.null;
          expect(fUser._id).to.eql(gUser._id);
          done();
        }
      });
    });

    it('getById()', function (done) {
      common.userModel.getById(pUser._id, false, function (err, fUser) {
        if (err) {
          done(err);
        } else {
          expect(fUser).to.not.be.null;
          expect(fUser._id).to.eql(pUser._id);
          done();
        }
      });
    });

    it('getByPseudo()', function (done) {
      common.userModel.getByPseudo(pUser.pseudo, function (err, fUser) {
        if (err) {
          done(err);
        } else {
          expect(fUser).to.not.be.null;
          expect(fUser._id).to.eql(pUser._id);
          done();
        }
      });
    });

    it('follow()', function (done) {
      pUser.follow(faUser, function (err) {
        if (err) {
          done(err);
        } else {
          common.userModel.getById(pUser._id, true, function (err, fUser) {
            if (err) {
              done(err);
            } else {
              expect(fUser).to.not.be.null;
              expect(fUser.following).to.have.lengthOf(1);
              expect(fUser.following[0]._id).to.eql(faUser._id);
              expect(fUser.following[0].pseudo).to.eql(faUser.pseudo);
              pUser = fUser;
              done();
            }
          });
        }
      });
    });

    it('toObject', function () {
      const obj = pUser.toObject({print: true});
      expect(obj._id).to.be.undefined;
      expect(obj.id).to.eql(pUser._id);
      expect(obj.password).to.be.undefined;
      expect(obj.__v).to.be.undefined;
      expect(obj.following[0]._id).to.be.undefined;
    });

    it('unfollow()', function (done) {
      pUser.unfollow(faUser, function (err) {
        if (err) {
          done(err);
        } else {
          common.userModel.getById(pUser._id, true, function (err, fUser) {
            if (err) {
              done(err);
            } else {
              expect(fUser).to.not.be.null;
              expect(fUser.following).to.have.lengthOf(0);
              done();
            }
          });
        }
      });
    });

    it('toObject', function () {
      const obj = pUser.toObject({print: true});
      expect(obj._id).to.be.undefined;
      expect(obj.id).to.eql(pUser._id);
      expect(obj.password).to.be.undefined;
      expect(obj.__v).to.be.undefined;
    });

    it('get fullname', function (done) {
      expect(pUser.fullName).to.equal(pUser.firstName + ' ' + pUser.lastName);
      done();
    });
  });

  describe('Testing report model', function () {
    it('createNew()', function (done) {
      common.reportModel.createNew(pUser, faUser, fixture.motif1, function (err, cReport) {
        if (err) {
          done(err);
        } else {
          expect(cReport).to.not.be.undefined;
          expect(cReport.user.pseudo).to.equal(pUser.pseudo);
          expect(cReport.by.pseudo).to.equal(faUser.pseudo);
          expect(cReport.motif).to.equal(fixture.motif1);
          done();
        }
      });
    });

    it('createNew()', function (done) {
      common.reportModel.createNew(pUser, faUser, fixture.motif2, function (err, cReport) {
        if (err) {
          done(err);
        } else {
          expect(cReport).to.not.be.undefined;
          expect(cReport.user.pseudo).to.equal(pUser.pseudo);
          expect(cReport.by.pseudo).to.equal(faUser.pseudo);
          expect(cReport.motif).to.equal(fixture.motif2);
          done();
        }
      });
    });

    it('getAllReport()', function (done) {
      common.reportModel.getAllReport(pUser, function (err, fReports) {
        if (err) {
          done(err);
        } else {
          expect(fReports).to.have.lengthOf(2);
          expect(fReports[0].user.pseudo).to.equal(pUser.pseudo);
          expect(fReports[0].by.pseudo).to.equal(faUser.pseudo);
          done();
        }
      });
    });
  });
});
