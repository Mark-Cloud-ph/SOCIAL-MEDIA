const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const followRoutes = require('./routes/followRoutes');
const db = require('./config/db');  // Assuming db.js is in config folder

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration to allow requests from specific frontend origins
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],  // List multiple allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));  // Use CORS with the defined options

// Middleware
app.use(express.json());  // Replacing body-parser with express.json()

// Routes
app.use('/api/users', userRoutes);      // User-related routes
app.use('/api/posts', postRoutes);      // Post-related routes
app.use('/api/comments', commentRoutes); // Comment-related routes
app.use('/api/likes', likeRoutes);     // Like-related routes
app.use('/api/follows', followRoutes); // Follow-related routes

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media API');
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error stack for debugging
  res.status(500).json({ message: "Something went wrong!" });  // Send error response
});

// Database connection is automatically established when the app starts
// No need to call db.connect()

// Start the server
const PORT = process.env.PORT || 5000;  // Use PORT from .env or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
