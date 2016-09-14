const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
const lib = {
  utils: require('./lib/utils'),
  clientModel: require('./lib/models/client'),
  userModel: require('./lib/models/user'),
  accessTokenModel: require('./lib/models/access-token'),
  refreshTokenModel: require('./lib/models/refresh-token'),
  reportModel: require('./lib/models/report')
};

module.exports = lib;
