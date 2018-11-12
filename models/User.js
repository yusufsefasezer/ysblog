const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

// User
const UserSchema = new Schema({
  email: { type: String, required: true, trim: true, lowercase: true, index: true },
  password: String,
  fname: String,
}, { timestamps: true });

UserSchema.statics.md5 = function (password) {
  return crypto.createHash('md5').update(password).digest('hex');
};

UserSchema.methods.validPassword = function (password) {
  return User.md5(password) === this.password;
};

UserSchema.statics.validEmail = function (email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const User = mongoose.model('user', UserSchema);

module.exports = User;