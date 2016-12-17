const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSubscriptionSchema = new Schema({
  tag: {
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

tagSubscriptionSchema.statics.createNew = function (tagId, userId, cb) {
  tagSubscriptionModel.create({
    tag: tagId,
    user: userId
  }, cb);
};

tagSubscriptionSchema.statics.getUserSubscription = function (userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    cb(null, false);
  } else {
    tagSubscriptionModel.find({ user: userId }).populate('tag').exec(cb);
  }
};

tagSubscriptionSchema.statics.userIsSubscribed = function (tagId, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tagId)) {
    cb(null, false);
  } else {
    tagSubscriptionModel.findOne({ tag: tagId, user: userId }, function (err, fSubscription) {
      if (err) {
        cb(err);
      } else if (fSubscription == null) {
        cb(null, false);
      } else {
        cb(null, true);
      }
    });
  }
};

tagSubscriptionSchema.statics.removeSubscription = function (tagId, userId, cb) {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tagId)) {
    cb(null, false);
  } else {
    tagSubscriptionModel.findOne({ tag: tagId, user: userId }, function (err, fSubscription) {
      if (err) {
        cb(err);
      } else if (fSubscription == null) {
        cb(null, false);
      } else {
        fSubscription.remove(function (err) {
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

const tagSubscriptionModel = mongoose.model('TagSubscription', tagSubscriptionSchema);

module.exports = tagSubscriptionModel;
