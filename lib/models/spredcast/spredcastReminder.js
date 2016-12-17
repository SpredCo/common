const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spredcastReminderSchema = new Schema({
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

spredcastReminderSchema.statics.createNew = function (castId, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(userId)) {
    cb(true, null);
  } else {
    spredcastReminderModel.create({
      cast: castId,
      user: userId
    }, cb);
  }
};

spredcastReminderSchema.statics.getUserReminder = function (userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, false);
  } else {
    spredcastReminderModel.find({user: userId}).populate('cast').exec(cb);
  }
};

spredcastReminderSchema.statics.getCastReminder = function (castId, cb) {
  if (!mongoose.Types.ObjectId.isValid(castId)) {
    cb(null, false);
  } else {
    spredcastReminderModel.find({cast: castId}).populate('user').exec(cb);
  }
};

spredcastReminderSchema.statics.userIsReminded = function (castId, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(castId) || !mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, false);
  } else {
    spredcastReminderModel.findOne({cast: castId, user: userId}, function (err, fCast) {
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

spredcastReminderSchema.statics.removeReminder = function (castId, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(castId) || !mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, false);
  } else {
    spredcastReminderModel.findOne({cast: castId, user: userId}, function (err, fCast) {
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

spredcastReminderSchema.statics.getUserReminderByCastIds = function (castIds, userId, cb) {
  var idValid = true;
  castIds.every(function (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      idValid = false;
      return false;
    }
    return true;
  });
  if (!idValid || !mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, false);
  } else {
    spredcastReminderModel.find({ cast: {$in: castIds}, user: userId }, cb);
  }
};

if (!spredcastReminderSchema.options.toObject) spredcastReminderSchema.options.toObject = {};
spredcastReminderSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.print) {
    ret.id = ret._id;
    ret._id = undefined;
    ret.updatedAt = undefined;
  }
  return ret;
};

const spredcastReminderModel = mongoose.model('SpredcastReminder', spredcastReminderSchema);

module.exports = spredcastReminderModel;
