const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  govidproof: { type: String },
  profileImage: { type: String ,default: ''},
  friends: [{
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String }, // Store friend's username for fast lookup
    profilePic: { type: String, default: '' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
