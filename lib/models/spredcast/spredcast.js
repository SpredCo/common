const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spredcastSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
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
  coverUrl: {
    type: String,
    required: false
  },
  userCapacity: {
    type: Number
  },
  userCount: {
    type: Number
  },
  state: {
    type: Number
  },
  url: {
    required: true,
    type: String
  }
}, { timestamp: true });

spredcastSchema.statics.createNew = function (creator, name, description, tags, date, isPublic, userCapacity, members, duration, url, coverUrl, cb) {
  if (date === 'now') {
    date = new Date();
  }
  spredcastModel.create({
    name: name,
    tags: tags,
    description: description,
    duration: duration,
    date: date,
    isPublic: isPublic,
    coverUrl: coverUrl,
    members: members,
    creator: creator,
    userCapacity: userCapacity,
    state: 0,
    userCount: 0,
    url: url
  }, cb);
};

spredcastSchema.statics.getById = function (id, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(null, null);
  } else {
    spredcastModel.findOne({_id: id, state: {$in: [0, 1]}, date: {$lt: new Date()}}).exec(cb);
  }
};

spredcastSchema.statics.findAvailableCast = function (cb) {
  spredcastModel.find({ $or: [{ date: { $gt: new Date() } }, { state: 1 }] }).populate('creator members tags').exec(cb);
};

spredcastSchema.statics.getByUrl = function (url, cb) {
  spredcastModel.findOne({ url: url }).populate('creator members tags').exec(cb);
};

spredcastSchema.statics.getByUser = function (userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, null);
  } else {
    spredcastModel.find({creator: userId}).sort('-state').populate('creator members tags').exec(cb);
  }
};

spredcastSchema.statics.getByTag = function (tags, cb) {
  spredcastModel.find({ $or: [{ date: { $gt: new Date() } }, { state: 1 }], tags: tags }, cb);
};

spredcastSchema.statics.userCanJoin = function (id, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(null, false, null);
  } else {
    spredcastModel.getById(id, function (err, fCast) {
      if (err) {
        cb(err);
      } else if (!fCast) {
        cb(null, false, false, null);
      } else {
        if (fCast.state !== 2 && userId !== null && userId.toString() === fCast.creator.toString()) {
          cb(null, true, true, fCast);
        } else if (fCast.state !== 1) {
          cb(null, false, false, fCast);
        } else if (fCast.userCount === fCast.userCapacity) {
          cb(null, false, false, fCast);
        } else if (fCast.isPublic || (userId !== null && fCast.members.indexOf(userId) !== -1)) {
          cb(null, true, false, fCast);
        } else {
          cb(null, false, false, fCast);
        }
      }
    });
  }
};

spredcastSchema.statics.updateState = function (id, state, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(true);
  } else {
    spredcastModel.findOneAndUpdate({_id: id}, {state: state}, cb);
  }
};

spredcastSchema.statics.updateUserCount = function (id, count, cb) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    cb(true);
  } else {
    spredcastModel.findOneAndUpdate({_id: id}, {userCount: count}, cb);
  }
};

if (!spredcastSchema.options.toObject) spredcastSchema.options.toObject = {};
spredcastSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.print) {
    var tags = [];
    var members = [];
    ret.id = ret._id;
    ret._id = undefined;
    ret.__v = undefined;
    ret.updatedAt = undefined;
    if (ret.members) {
      ret.members.forEach(function (member) {
        if (member._id) {
          member.id = member._id;
          member._id = undefined;
          member.password = undefined;
          member.googleId = undefined;
          member.facebookId = undefined;
          member.following = undefined;
          member.__v = undefined;
        }
        members.push(member);
      });
    }
    ret.members = members;
    ret.is_public = ret.isPublic;
    ret.user_count = ret.userCount;
    ret.user_capacity = ret.userCapacity;
    ret.cover_url = ret.coverUrl;
    if (ret.creator._id) {
      ret.creator.id = ret.creator._id;
      ret.creator._id = undefined;
      ret.creator.password = undefined;
      ret.creator.googleId = undefined;
      ret.creator.facebookId = undefined;
      ret.creator.following = undefined;
      ret.creator.__v = undefined;
    }
    ret.tags.forEach(function (tag) {
      tags.push({
        id: tag._id,
        name: tag.name,
        description: tag.description
      });
    });
    ret.isPublic = undefined;
    ret.userCount = undefined;
    ret.userCapacity = undefined;
    ret.coverUrl = undefined;
  }
  return ret;
};

const spredcastModel = mongoose.model('SpredCast', spredcastSchema);

module.exports = spredcastModel;
