
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  google: String,
  tokens: Array,

  profile: {
    name: String,
    picture: String,
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;