const db = require('../config/db');

// Follow User
const followUser = (req, res) => {
    const { followed_id } = req.body;
    const followerId = req.user;

    const query = 'INSERT INTO Follow (follower_id, followed_id) VALUES (?, ?)';
    db.run(query, [followerId, followed_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User followed successfully' });
    });
};

// Unfollow User
const unfollowUser = (req, res) => {
    const { followed_id } = req.body;
    const followerId = req.user;

    const query = 'DELETE FROM Follow WHERE follower_id = ? AND followed_id = ?';
    db.run(query, [followerId, followed_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'User unfollowed successfully' });
    });
};

module.exports = { followUser, unfollowUser };
