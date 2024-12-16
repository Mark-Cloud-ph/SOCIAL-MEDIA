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

// CORS configuration to allow requests from frontend (localhost:3000)
const corsOptions = {
  origin: 'http://localhost:5173',  // Adjust as per your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));  // Use CORS with the defined options

// Middleware
app.use(express.json());  // Replacing body-parser with express.json()

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/follows', followRoutes);

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

// Database connection (optional to confirm database connection works)
db.connect(err => {
  if (err) {
    console.error('Database connection error: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Start the server
const PORT = process.env.PORT || 5000;  // Use PORT from .env or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
