const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spredcastRegistrationSchema = new Schema({
  cast: {
    type: Schema.Types.ObjectId,
    ref: 'SpredCast',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

spredcastRegistrationSchema.statics.createNew = function (castId, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(userId)) {
    cb(true, null);
  } else {
    spredcastRegistrationModel.create({
      cast: castId,
      user: userId
    }, cb);
  }
};

spredcastRegistrationSchema.statics.getUserRegistration = function (userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, false);
  } else {
    spredcastRegistrationModel.find({user: userId}).populate('cast').exec(cb);
  }
};

spredcastRegistrationSchema.statics.getCastRegistration = function (castId, cb) {
  if (!mongoose.Types.ObjectId.isValid(castId)) {
    cb(null, false);
  } else {
    spredcastRegistrationModel.find({cast: castId}).populate('user').exec(cb);
  }
};

spredcastRegistrationSchema.statics.userIsRegistered = function (castId, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(castId) || !mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, false);
  } else {
    spredcastRegistrationModel.findOne({cast: castId, user: userId}, function (err, fCast) {
      if (err) {
        cb(err, false);
      } else if (fCast == null) {
        cb(null, false);
      } else {
        cb(null, true);
      }
    });
  }
};

spredcastRegistrationSchema.statics.unRegister = function (castId, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(castId) || !mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, false);
  } else {
    spredcastRegistrationModel.findOne({cast: castId, user: userId}, function (err, fCast) {
      if (err) {
        cb(err, false);
      } else if (fCast == null) {
        cb(null, false);
      } else {
        fCast.remove(function (err) {
          if (err) {
            cb(err);
          } else {
            cb(null, true);
          }
        });
      }
    });
  }
};

if (!spredcastRegistrationSchema.options.toObject) spredcastRegistrationSchema.options.toObject = {};
spredcastRegistrationSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.print) {
    ret.id = ret._id;
    ret._id = undefined;
    ret.updatedAt = undefined;
  }
  return ret;
};

const spredcastRegistrationModel = mongoose.model('SpredcastRegistration', spredcastRegistrationSchema);

module.exports = spredcastRegistrationModel;
