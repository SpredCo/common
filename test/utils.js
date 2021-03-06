const common = require('../');
const expect = require('chai').expect;
const fixture = require('./fixture/utils.json');

it('getRandomInt', function () {
  const rd = common.utils.getRandomInt(fixture.random.min, fixture.random.max);
  expect(rd).to.be.greaterThan(fixture.random.min);
  expect(rd).to.be.lessThan(fixture.random.max + 1);
});

it('uidGen', function () {
  const uid = common.utils.uidGen(fixture.uidGen.len);
  expect(uid).to.have.lengthOf(fixture.uidGen.len);
});

it('arrayHasDuplicate', function () {
  const result = common.utils.arrayHasDuplicate(['test', 'tests', 'hello', 'salut', 'test']);
  expect(result).to.be.true;
});

it('arrayHasDuplicate', function () {
  const result = common.utils.arrayHasDuplicate(['test', 'tests', 'hello', 'salut']);
  expect(result).to.be.false;
});
