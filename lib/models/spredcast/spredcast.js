const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spredcastSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  tags: [String],
  description: {
    type: String, required: true
  },
  duration: {
    type: Number
  },
  date: {
    type: Date,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userCapacity: {
    type: Number
  },
  userCount: {
    type: Number
  },
  state: {
    type: Number
  }
}, { timestamp: true });

spredcastSchema.statics.createNew = function (creator, name, description, tags, date, isPublic, userCapacity, members, duration, cb) {
  if (date == 'now') {
    date = new Date();
  }
  spredcastModel.create({
    name: name,
    tags: tags,
    description: description,
    duration: duration,
    date: date,
    isPublic: isPublic,
    members: members,
    creator: creator,
    userCapacity: userCapacity,
    state: 0,
    userCount: 0
  }, cb);
};

spredcastSchema.statics.getById = function (id, cb) {
  spredcastModel.findOne({ _id: id, state: { $in: [0, 1] }, date: { $lt: new Date() } }, cb);
};

spredcastSchema.statics.userCanJoin = function (id, userId, cb) {
  spredcastModel.getById(id, function (err, fCast) {
    if (err) {
      cb(err);
    } else {
      if (fCast.state == 0 && userId !== null && userId.toString() === fCast.creator.toString()) {
        cb(null, true, fCast);
      }
      else if (fCast.state !== 1) {
        cb(null, false, fCast);
      } else if (fCast.userCount === fCast.userCapacity) {
        cb(null, false, fCast);
      } else if (fCast.isPublic || (userId !== null && fCast.members.indexOf(userId) !== -1)) {
        cb(null, true, fCast);
      }
    }
  });
};

spredcastSchema.statics.updateState = function (id, state, cb) {
  spredcastModel.findOneAndUpdate({ _id : id }, { state: state }, cb);
};

spredcastSchema.methods.updateUserCount = function (id, count, cb) {
  spredcastModel.findOneAndUpdate({ _id : id }, { count: count }, cb);
};

const spredcastModel = mongoose.model('SpredCast', spredcastSchema);

module.exports = spredcastModel;
