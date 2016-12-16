const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const followSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

followSchema.statics.createNew = function (userId, following, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    cb(true, null);
  } else {
    followingModel.create({
      user: userId,
      following: following
    }, cb);
  }
};

followSchema.statics.getUserFollow = function (userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, null);
  } else {
    followingModel.find({ user: userId }, cb);
  }
};

followSchema.statics.userIsFollowing = function (userId, followingId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followingId)) {
    cb(null, null);
  } else {
    followingModel.findOne({user: userId, following: followingId}, function (err, fFollow) {
      if (err) {
        cb(err);
      } else if (fFollow == null) {
        cb(null, false);
      } else {
        cb(null, true);
      }
    });
  }
};

followSchema.statics.unFollow = function (userId, followingId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followingId)) {
    cb(null, null);
  } else {
    followingModel.findOne({user: userId, following: followingId}, function (err, fFollow) {
      if (err) {
        cb(err);
      } else if (fFollow == null) {
        cb(null, false);
      } else {
        fFollow.remove(cb);
      }
    });
  }
};

if (!followSchema.options.toObject) followSchema.options.toObject = {};
followSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.print) {
    ret.id = ret._id;
    ret._id = undefined;
  }
  return ret;
};

const followingModel = mongoose.model('Follow', followSchema);

module.exports = followingModel;
