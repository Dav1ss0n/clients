const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    ref: 'Role',
    default: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
