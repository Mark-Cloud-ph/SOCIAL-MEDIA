const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); // Add timestamp
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

// Filter for file type (only PNG and JPEG allowed)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG and JPEG are allowed.'));
    }
};

const upload = multer({ storage, fileFilter });
// Register User
const registerUser = (req, res) => {
    const { username, email, password, profile_pic_url, bio } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO User (username, email, password_hash, profile_pic_url, bio) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [username, email, hashedPassword, profile_pic_url, bio], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        const token = jwt.sign({ user_id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    });
};

// Login User
const loginUser = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM User WHERE email = ?';
    db.get(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results) return res.status(400).json({ message: 'User not found' });

        const isMatch = bcrypt.compareSync(password, results.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ user_id: results.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    });
};

// Get User Profile (Own Profile)
const getUserProfile = (req, res) => {
    const userId = req.user;

    const query = 'SELECT * FROM User WHERE user_id = ?';
    db.get(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(results);
    });
};

// Get User Posts
const getUserPosts = (req, res) => {
    const { user_id } = req.params;

    const query = 'SELECT * FROM Post WHERE user_id = ?';
    db.all(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'No posts found for this user.' });

        res.status(200).json(results);
    });
};

// Get Another User's Profile
// Get Another User's Profile
// Get Another User's Profile by Searching with a Keyword

// Search Users by Keyword (Example: Searching by content or keywords)
// Search Users by Keyword
const getOtherUserProfile = (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = 'SELECT * FROM User WHERE username LIKE ?';
    db.all(searchQuery, [`%${query}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'No users found' });

        res.status(200).json(results);
    });
};
    

  const updateProfile = (req, res) => {
    const { username, bio } = req.body;
    const userId = req.user;

    let profile_pic_url = req.body.profile_pic_url;
    if (req.file) {
        profile_pic_url = `/uploads/${req.file.filename}`; // Path to the uploaded image
    }

    const query = 'UPDATE User SET username = ?, bio = ?, profile_pic_url = ? WHERE user_id = ?';
    db.run(query, [username || null, bio || null, profile_pic_url || null, userId], function (err) {
        if (err) {
            console.error('Database Error:', err); // Log error
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Profile updated successfully', profile_pic_url });
    });
};


module.exports = { registerUser, loginUser, getUserProfile, getOtherUserProfile, updateProfile , getUserPosts };