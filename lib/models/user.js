const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    bcrypt: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  googleId: String,
  facebookId: String,
  pictureUrl: {
    type: String,
    default: '/img/profile.jpg'
  }
}, {timestamps: true});

userSchema.virtual('fullName').get(function () { return this.firstName + ' ' + this.lastName; });

userSchema.statics.createPassword = function (email, password, firstName, lastName, cb) {
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      cb(err);
    } else {
      userModel.create({
        email: email,
        password: hash,
        firstName: firstName,
        lastName: lastName
      }, cb);
    }
  });
};

userSchema.statics.createFacebook = function (email, facebookId, firstName, lastName, pictureUrl, cb) {
  userModel.create({
    email: email,
    facebookId: facebookId,
    firstName: firstName,
    lastName: lastName,
    pictureUrl: pictureUrl
  }, cb);
};

userSchema.statics.createGoogle = function (email, googleId, firstName, lastName, pictureUrl, cb) {
  userModel.create({
    email: email,
    googleId: googleId,
    firstName: firstName,
    lastName: lastName,
    pictureUrl: pictureUrl
  }, cb);
};

userSchema.statics.getById = function (id, cb) {
  userModel.findOne({ _id: id }, cb);
};

userSchema.statics.getByEmail = function (email, cb) {
  userModel.findOne({ email: email }, cb);
};

userSchema.statics.getByPartialEmail = function (partialEmail, limit, cb) {
  userModel.find({ email: new RegExp('^' + partialEmail, 'i') })
    .limit(limit)
    .exec(cb);
};

userSchema.statics.getByCredential = function (email, password, cb) {
  userModel.findOne({ email: email }, function (err, fUser) {
    if (err) {
      cb(err);
    } else if (fUser == null) {
      cb(null, false);
    } else {
      bcrypt.compare(password, fUser.password, function (err, res) {
        if (err) {
          cb(err);
        } else {
          cb(null, res === true ? fUser : false);
        }
      });
    }
  });
};

userSchema.statics.getByFacebookId = function (facebookId, cb) {
  userModel.findOne({ facebookId: facebookId }, cb);
};

userSchema.statics.getByGoogleId = function (googleId, cb) {
  userModel.findOne({ googleId: googleId }, cb);
};

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.print) {
    ret.id = ret._id;
    ret._id = undefined;
    ret.password = undefined;
    ret.__v = undefined;
  }
  return ret;
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
