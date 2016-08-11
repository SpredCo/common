const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
const lib = {
  utils: require('./lib/utils'),
  userModel: require('./lib/models/user')
};

module.exports = lib;
