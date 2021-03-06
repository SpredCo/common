const mongoose = require('mongoose');
const utils = require('../../utils');

const Schema = mongoose.Schema;

const castTokenSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  pseudo: {
    type: String,
    required: true
  },
  cast: {
    type: Schema.Types.ObjectId,
    ref: 'SpredCast',
    required: true
  },
  presenter: {
    type: Boolean,
    require: true
  },
  token: {
    type: String,
    required: true
  }
}, { timestamp: true });

castTokenSchema.statics.createNew = function (client, user, cast, presenter, cb) {
  const pseudo = (user == null) ? 'guest-' + utils.uidGen(10) : user.pseudo;
  castTokenModel.create({
    client: client,
    user: user,
    pseudo: pseudo,
    cast: cast,
    presenter: presenter,
    token: utils.uidGen(256)
  }, cb);
};

castTokenSchema.statics.getByToken = function (token, cb) {
  castTokenModel.findOne({ token: token }).populate('user cast').exec(cb);
};

castTokenSchema.statics.revokeCast = function (castId, cb) {
  castTokenModel.remove({ cast: castId }, cb);
};

const castTokenModel = mongoose.model('CastToken', castTokenSchema);

module.exports = castTokenModel;
