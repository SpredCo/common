const common = require('../../');
const expect = require('chai').expect;
const fixture = require('../fixture/models/client.json');

var client;

describe('Testing Client model', function () {
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
        expect(fClients).to.have.lengthOf(2);
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

  it('toJson()', function () {
    const result = client.toJSON();

    expect(result).to.not.be.null;
    expect(result).to.be.an('object');
    expect(result._id).to.be.undefined;
    expect(result.__v).to.be.undefined;
  });
});
