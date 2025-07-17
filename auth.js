const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Friend = require('../models/friend');
const multer = require('multer');
const path = require('path');
const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Temporary OTP storage (in-memory)
const otpStorage = {};

// ================= Signup =================
router.post('/signup', upload.single('idProof'), async (req, res) => {
  try {
    const { name, username, email, phone, password, gender } = req.body;
    const govidproof = req.file ? req.file.path : null;

    if (!name || !username || !email || !phone || !password || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }

    const newUser = new User({ name, username, email, phone, password, gender, govidproof });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= Login =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= Send OTP =================
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 5 * 60 * 1000; // 5 minutes

    otpStorage[phone] = { otp, expires: Date.now() + ttl };

    await twilio.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// ================= Verify OTP =================
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const storedOtp = otpStorage[phone];
    if (!storedOtp) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (Date.now() > storedOtp.expires) {
      delete otpStorage[phone];
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    delete otpStorage[phone];
    res.status(200).json({ message: 'Phone number verified' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// ================= Search Users =================
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]); // Return empty array if no query
    }
    const users = await User.find({
      username: { $regex: q, $options: 'i' } // match anywhere, case-insensitive
    }).select('username profileImage _id');
    // Optional: log for debugging
    console.log('Search query:', q, 'Results:', users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// ================= Last Registered Users (limit param) =================
router.get('/last-logins', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    // Sort by _id descending (MongoDB ObjectId contains creation time)
    const users = await User.find({})
      .sort({ _id: -1 })
      .limit(limit)
      .select('username profileImage _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user by ID
router.delete('/user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile image
router.put('/user/:id/profile-image', async (req, res) => {
  try {
    const { profileImage } = req.body;
    await User.findByIdAndUpdate(req.params.id, { profileImage });
    res.json({ message: 'Profile image updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add friend to user's friend list (bi-directional)
router.post('/user/:id/add-friend', async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.params.id);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ message: 'User not found' });
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }
    if (!friend.friends.includes(user._id)) {
      friend.friends.push(user._id);
      await friend.save();
    }
    res.json({ message: 'Friend added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a friend request
router.post('/friend-request/:id/accept', async (req, res) => {
  try {
    const request = await Friend.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Update request status
    request.status = 'accepted';
    await request.save();

    // Add each user to the other's friends array
    const sender = await User.findById(request.sender);
    const receiver = await User.findById(request.receiver);

    if (sender && receiver) {
      // Add receiver to sender's friends if not already present
      if (!sender.friends.some(f => f.friendId.equals(receiver._id))) {
        sender.friends.push({
          friendId: receiver._id,
          username: receiver.username,
          profilePic: receiver.profileImage || ''
        });
        await sender.save();
      }
      // Add sender to receiver's friends if not already present
      if (!receiver.friends.some(f => f.friendId.equals(sender._id))) {
        receiver.friends.push({
          friendId: sender._id,
          username: sender.username,
          profilePic: sender.profileImage || ''
        });
        await receiver.save();
      }
    }

    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's friends list
router.get('/user/:id/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Return friends array with username/profilePic
    res.json(user.friends || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a friend request
router.post('/friend-request', async (req, res) => {
  try {
    const { senderId, senderUsername, receiverId, receiverUsername } = req.body;
    // Prevent duplicate requests
    const existing = await Friend.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });
    if (existing) return res.status(409).json({ message: 'Request already sent' });

    const request = new Friend({
      sender: senderId,
      senderUsername,
      receiver: receiverId,
      receiverUsername,
      status: 'pending'
    });
    await request.save();
    res.json({ message: 'Friend request sent', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all friend requests for a user (received)
router.get('/user/:id/friend-requests', async (req, res) => {
  try {
    const requests = await Friend.find({ receiver: req.params.id, status: 'pending' });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject/remove a friend request
router.post('/friend-request/:id/reject', async (req, res) => {
  try {
    await Friend.findByIdAndDelete(req.params.id);
    res.json({ message: 'Friend request removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend from user's friend list (bi-directional)
router.post('/user/:id/remove-friend', async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.params.id);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ message: 'User not found' });

    // Remove friend from user's friends array
    user.friends = user.friends.filter(f => !f.friendId.equals(friendId));
    await user.save();

    // Remove user from friend's friends array
    friend.friends = friend.friends.filter(f => !f.friendId.equals(user._id));
    await friend.save();

    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
