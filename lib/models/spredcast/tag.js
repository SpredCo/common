const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
});

tagSchema.statics.createNew = function (name, description, cb) {
  tagModel.create({
    name: name,
    description: description
  }, cb);
};

tagSchema.statics.getAll = function (cb) {
  tagModel.find({}, cb);
};

tagSchema.statics.getByName = function (name, cb) {
  tagModel.findOne({name: name}, cb);
};

tagSchema.statics.search = function (partialName, limit, cb) {
  tagModel.find({ name: new RegExp('^' + partialName, 'i') })
    .limit(limit)
    .exec(cb);
};

if (!tagSchema.options.toObject) tagSchema.options.toObject = {};
tagSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.print) {
    ret.id = ret._id;
    ret._id = undefined;
    ret.__v = undefined;
  }
  return ret;
};

const tagModel = mongoose.model('Tag', tagSchema);

module.exports = tagModel;
