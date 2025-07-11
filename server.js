const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
// Remove or comment out the next line if userRoutes.js does not have a /search route
// app.use('/api/users', require('./routes/userRoutes'));


// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Add this to expose /api/users/search
const userRoutes = require('./routes/auth'); // If search is in auth.js
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
