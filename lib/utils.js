
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uidGen (len) {
  const buf = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
}

function arrayHasDuplicate (array) {
  var dup = false;
  var seen = [];

  array.forEach(function (a) {
    if (seen[a] === 1) {
      dup = true;
    }
    seen[a] = 1;
  });
  return dup;
}

module.exports.getRandomInt = getRandomInt;
module.exports.uidGen = uidGen;
module.exports.arrayHasDuplicate = arrayHasDuplicate;
