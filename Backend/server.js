// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize express app
const app = express();

// Use PORT from .env file or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connected successfully.'))
.catch(err => console.error(' MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

// Use routes
app.use('/api/auth', authRoutes);   //  For login and registration
app.use('/api/notes', notesRoutes); //  For all note-related CRUD operations

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(' Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
