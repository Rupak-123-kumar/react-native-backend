const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    department: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
