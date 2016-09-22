const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
const lib = {
  utils: require('./lib/utils'),
  clientModel: require('./lib/models/auth/client'),
  userModel: require('./lib/models/user/user'),
  accessTokenModel: require('./lib/models/auth/access-token'),
  refreshTokenModel: require('./lib/models/auth/refresh-token'),
  reportModel: require('./lib/models/user/report'),
  conversationModel: require('./lib/models/inbox/conversation'),
  messageModel: require('./lib/models/inbox/message'),
  messageReadModel: require('./lib/models/inbox/messageRead')
};

module.exports = lib;
