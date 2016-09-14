const common = require('../../');
const expect = require('chai').expect;
const fixture = require('../fixture/models/report.json');

var user1;
var user2;

describe('Testing report model', function () {
  before(function (done) {
    common.userModel.createPassword(fixture.user1.email, fixture.user1.password, fixture.user1.pseudo,
      fixture.user1.firstName, fixture.user1.lastName, function (err, cUser) {
        if (err) {
          done(err);
        } else {
          common.userModel.createPassword(fixture.user2.email, fixture.user2.password, fixture.user2.pseudo,
            fixture.user2.firstName, fixture.user2.lastName, function (err, cUser2) {
              if (err) {
                done(err);
              } else {
                user1 = cUser;
                user2 = cUser2;
                done();
              }
            });
        }
      });
  });

  it('createNew()', function (done) {
    common.reportModel.createNew(user1, user2, fixture.motif1, function (err, cReport) {
      if (err) {
        done(err);
      } else {
        expect(cReport).to.not.be.undefined;
        expect(cReport.user.pseudo).to.equal(fixture.user1.pseudo);
        expect(cReport.by.pseudo).to.equal(fixture.user2.pseudo);
        expect(cReport.motif).to.equal(fixture.motif1);
        done();
      }
    });
  });

  it('createNew()', function (done) {
    common.reportModel.createNew(user1, user2, fixture.motif2, function (err, cReport) {
      if (err) {
        done(err);
      } else {
        expect(cReport).to.not.be.undefined;
        expect(cReport.user.pseudo).to.equal(fixture.user1.pseudo);
        expect(cReport.by.pseudo).to.equal(fixture.user2.pseudo);
        expect(cReport.motif).to.equal(fixture.motif2);
        done();
      }
    });
  });

  it('getAllReport()', function (done) {
    common.reportModel.getAllReport(user1, function (err, fReports) {
      if (err) {
        done(err);
      } else {
        expect(fReports).to.have.lengthOf(2);
        expect(fReports[0].user.pseudo).to.equal(fixture.user1.pseudo);
        expect(fReports[0].by.pseudo).to.equal(fixture.user2.pseudo);
        done();
      }
    });
  });
});
