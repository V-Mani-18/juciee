const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // Added
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  govidproof: { type: String }, // Added (store file path or URL)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
