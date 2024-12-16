const db = require('../config/db');

// Like a Post
const likePost = (req, res) => {
    const { post_id } = req.body;
    const userId = req.user;

    const query = 'INSERT INTO Likes (user_id, post_id) VALUES (?, ?)';
    db.run(query, [userId, post_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Post liked successfully' });
    });
};

// Unlike a Post
// Unlike a Post
const unlikePost = (req, res) => {
    const { post_id } = req.params;
    const userId = req.user;

    const query = 'DELETE FROM Likes WHERE user_id = ? AND post_id = ?';
    db.run(query, [userId, post_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Like not found' });
        res.status(200).json({ message: 'Post unliked successfully' });
    });
};


module.exports = { likePost, unlikePost };
