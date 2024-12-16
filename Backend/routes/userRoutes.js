const express = require('express');
const multer = require('multer');
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    getOtherUserProfile, 
    updateProfile, 
    getUserPosts
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const dir = path.join(__dirname, '../uploads/Images');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir); // Folder to store uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); // Add timestamp to filename
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

// File filter for image types (only PNG and JPEG allowed)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG and JPEG are allowed.'));
    }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to log in a user
router.post('/login', loginUser);

// Route to get the logged-in user's profile (protected)
router.get('/profile', protect, getUserProfile);

// Route to search users by keyword
router.get('/searching', getOtherUserProfile);

// Route to update the logged-in user's profile (protected)
router.put('/profile', protect, upload.single('profile_pic_url'), updateProfile);

// Assuming the route is to get user posts by their userId
router.get('/:user_id', getUserPosts);

module.exports = router;
