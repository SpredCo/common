const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  motif: {
    type: String,
    required: true
  }
}, { timestamp: true });

reportSchema.statics.createNew = function (user, by, motif, cb) {
  reportModel.create({
    user: user,
    by: by,
    motif: motif
  }, cb);
};

reportSchema.statics.getAllReport = function (user, cb) {
  reportModel.find({ user: user }).populate('user by').exec(cb);
};

const reportModel = mongoose.model('Report', reportSchema);

module.exports = reportModel;
