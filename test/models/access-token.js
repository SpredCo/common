const common = require('../../');
const expect = require('chai').expect;
const fixture = require('../fixture/models/access-token.json');

var user;
var client;
var token;

describe('Testing access_token model', function () {
  before(function (done) {
    common.userModel.createPassword(fixture.user.email,
      fixture.user.password,
      fixture.user.firstName,
      fixture.user.lastName,
      function (err, cUser) {
        if (err) {
          done(err);
        } else {
          common.clientModel.createNew(fixture.client.name,
            function (err, cClient) {
              if (err) {
                done(err);
              } else {
                user = cUser;
                client = cClient;
                done();
              }
            });
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
          token = cToken;
          done();
        }
      });
  });

  it('createFix()', function (done) {
    common.accessTokenModel.createFix(client,
      user,
      fixture.token,
      function (err, cToken) {
        if (err) {
          done(err);
        } else {
          expect(cToken.token).to.equal(fixture.token);
          expect(cToken.user._id).to.eql(user._id);
          expect(cToken.client._id).to.eql(client._id);
          token = cToken;
          done();
        }
      });
  });

  it('getByToken()', function (done) {
    common.accessTokenModel.getByToken(token.token, function (err, fToken) {
      if (err) {
        done(err);
      } else {
        expect(fToken).to.not.be.null;
        expect(fToken._id).to.eql(token._id);
        expect(fToken.user.publicId).to.equal(user.publicId);
        expect(fToken.client.name).to.equal(client.name);
        done();
      }
    });
  });

  it('getByClientToken()', function (done) {
    common.accessTokenModel.getByClientToken(client, token.token, function (err, fToken) {
      if (err) {
        done(err);
      } else {
        expect(fToken).to.not.be.null;
        expect(fToken._id).to.eql(token._id);
        done();
      }
    });
  });

  it('deleteTokenForUser()', function (done) {
    common.accessTokenModel.deleteTokenForUser(user, function (err) {
      if (err) {
        done(err);
      } else {
        common.accessTokenModel.getByToken(token.token, function (err, fToken) {
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
    expect(token.duration).to.equal(3600);
    done();
  });

  it('get lenght', function (done) {
    expect(token.length).to.equal(256);
    done();
  });

  it('get type', function (done) {
    expect(token.type).to.equal('bearer');
    done();
  });
});
