const common = require('../../index');
const expect = require('chai').expect;
const fixture = require('../fixture/models/auth.json');

var client;
var user;
var accessToken;
var refreshToken;

describe('Testing auth models', function () {
  describe('Testing client model', function () {
    it('createNew()', function (done) {
      common.clientModel.createNew(fixture.client1.name, function (err, cClient) {
        if (err) {
          done(err);
        }	else {
          expect(cClient.name).to.equal(fixture.client1.name);
          expect(cClient.key).to.not.be.null;
          expect(cClient.secret).to.not.be.null;
          expect(cClient.trusted).to.be.true;
          done();
        }
      });
    });

    it('createFixClient()', function (done) {
      common.clientModel.createFix(fixture.client2.name,
        fixture.client2.key,
        fixture.client2.secret,
        function (err, cClient) {
          if (err) {
            done(err);
          }	else {
            expect(cClient.name).to.equal(fixture.client2.name);
            expect(cClient.key).to.equal(fixture.client2.key);
            expect(cClient.secret).to.equal(fixture.client2.secret);
            expect(cClient.trusted).to.be.true;
            client = cClient;
            done();
          }
        });
    });

    it('getAll()', function (done) {
      common.clientModel.getAll(function (err, fClients) {
        if (err) {
          done(err);
        } else {
          expect(fClients).to.be.an('array');
          done();
        }
      });
    });

    it('getByKey()', function (done) {
      common.clientModel.getByKey(client.key, function (err, fClient) {
        if (err) {
          done(err);
        } else {
          expect(fClient).to.not.be.null;
          expect(fClient._id).to.eql(client._id);
          done();
        }
      });
    });

    it('getByCredential()', function (done) {
      common.clientModel.getByCredential(client.key, client.secret, function (err, fClient) {
        if (err) {
          done(err);
        } else {
          expect(fClient).to.not.be.null;
          expect(fClient._id).to.eql(client._id);
          done();
        }
      });
    });

    it('getByName()', function (done) {
      common.clientModel.getByName(client.name, function (err, fClient) {
        if (err) {
          done(err);
        } else {
          expect(fClient).to.not.be.null;
          expect(fClient._id).to.eql(client._id);
          done();
        }
      });
    });

    it('trust()', function (done) {
      client.trust(function (err) {
        if (err) {
          done(err);
        } else {
          expect(client.trusted).to.be.true;
          done();
        }
      });
    });

    it('toObject()', function () {
      const result = client.toObject({print: true});

      expect(result).to.not.be.null;
      expect(result).to.be.an('object');
      expect(result._id).to.be.undefined;
      expect(result.__v).to.be.undefined;
    });
  });

  describe('Testing access_token model', function () {
    before(function (done) {
      common.userModel.createPassword(fixture.user.email,
        fixture.user.password,
        fixture.user.pseudo,
        fixture.user.firstName,
        fixture.user.lastName,
        function (err, cUser) {
          if (err) {
            done(err);
          } else {
            user = cUser;
            done();
          }
        });
    });

    it('createNew()', function (done) {
      common.accessTokenModel.createNew(client,
        user,
        function (err, cToken) {
          if (err) {
            done(err);
          } else {
            expect(cToken.token.length).to.equal(256);
            expect(cToken.user._id).to.equal(user._id);
            expect(cToken.client._id).to.equal(client._id);
            accessToken = cToken;
            done();
          }
        });
    });

    it('createFix()', function (done) {
      common.accessTokenModel.createFix(client,
        user,
        fixture.accessToken,
        function (err, cToken) {
          if (err) {
            done(err);
          } else {
            expect(cToken.token).to.equal(fixture.accessToken);
            expect(cToken.user._id).to.eql(user._id);
            expect(cToken.client._id).to.eql(client._id);
            accessToken = cToken;
            done();
          }
        });
    });

    it('getByToken()', function (done) {
      common.accessTokenModel.getByToken(accessToken.token, function (err, fToken) {
        if (err) {
          done(err);
        } else {
          expect(fToken).to.not.be.null;
          expect(fToken._id).to.eql(accessToken._id);
          expect(fToken.user.publicId).to.equal(user.publicId);
          expect(fToken.client.name).to.equal(client.name);
          done();
        }
      });
    });

    it('getByClientToken()', function (done) {
      common.accessTokenModel.getByClientToken(client, accessToken.token, function (err, fToken) {
        if (err) {
          done(err);
        } else {
          expect(fToken).to.not.be.null;
          expect(fToken._id).to.eql(accessToken._id);
          done();
        }
      });
    });

    it('deleteTokenForUser()', function (done) {
      common.accessTokenModel.deleteTokenForUser(user, function (err) {
        if (err) {
          done(err);
        } else {
          common.accessTokenModel.getByToken(accessToken.token, function (err, fToken) {
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

    it('get duration', function (done) {
      expect(accessToken.duration).to.equal(3600);
      done();
    });

    it('get lenght', function (done) {
      expect(accessToken.length).to.equal(256);
      done();
    });

    it('get type', function (done) {
      expect(accessToken.type).to.equal('bearer');
      done();
    });
  });

  describe('Testing refresh_token model', function () {
    it('createNew()', function (done) {
      common.refreshTokenModel.createNew(client,
        user,
        function (err, cToken) {
          if (err) {
            done(err);
          } else {
            expect(cToken.token.length).to.equal(256);
            expect(cToken.user._id).to.equal(user._id);
            expect(cToken.client._id).to.equal(client._id);
            expect(cToken.revoked).to.be.false;
            refreshToken = cToken;
            done();
          }
        });
    });

    it('createFix()', function (done) {
      common.refreshTokenModel.createFix(client,
        user,
        fixture.refreshToken,
        function (err, cToken) {
          if (err) {
            done(err);
          } else {
            expect(cToken.token).to.equal(fixture.refreshToken);
            expect(cToken.user._id).to.eql(user._id);
            expect(cToken.client._id).to.eql(client._id);
            expect(cToken.revoked).to.be.false;
            done();
          }
        });
    });

    it('getByToken()', function (done) {
      common.refreshTokenModel.getByToken(refreshToken.token, function (err, fToken) {
        if (err) {
          done(err);
        } else {
          expect(fToken).to.not.be.null;
          expect(fToken._id).to.eql(refreshToken._id);
          done();
        }
      });
    });

    it('getByClientToken()', function (done) {
      common.refreshTokenModel.getByClientToken(client, refreshToken.token, function (err, fToken) {
        if (err) {
          done(err);
        } else {
          expect(fToken).to.not.be.null;
          expect(fToken._id).to.eql(refreshToken._id);
          done();
        }
      });
    });

    it('deleteTokenForUser()', function (done) {
      common.refreshTokenModel.deleteTokenForUser(user, function (err) {
        if (err) {
          done(err);
        } else {
          common.refreshTokenModel.getByToken(refreshToken.token, function (err, fToken) {
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

    it('revoke()', function (done) {
      refreshToken.revoke(function (err) {
        if (err) {
          done(err);
        } else {
          expect(refreshToken.revoked).to.be.true;
          done();
        }
      });
    });

    it('get duration', function (done) {
      expect(refreshToken.duration).to.equal(24 * 3600);
      done();
    });

    it('get lenght', function (done) {
      expect(refreshToken.length).to.equal(256);
      done();
    });
  });
});
