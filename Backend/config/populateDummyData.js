const bcrypt = require('bcryptjs');  // For hashing passwords
const db = require('./db');  // Import the database connection

// Dummy Users
const users = [
  { username: 'john_doe', email: 'john.doe@example.com', password: 'password123' },
  { username: 'jane_smith', email: 'jane.smith@example.com', password: 'password456' },
  { username: 'alice_wonder', email: 'alice.wonder@example.com', password: 'password789' },
  { username: 'bob_brown', email: 'bob.brown@example.com', password: 'password000' }
];

// Create Users with hashed passwords
const createUsers = async () => {
  for (let user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const query = `INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?)`;

    db.run(query, [user.username, user.email, hashedPassword], (err) => {
      if (err) {
        console.error(`Error creating user ${user.username}: ` + err.message);
      } else {
        console.log(`User ${user.username} created successfully.`);
      }
    });
  }
};

// Dummy Posts Data
const posts = [
  { user_id: 1, content: 'This is John\'s first post.' },
  { user_id: 2, content: 'Hello from Jane! This is my first post.' },
  { user_id: 3, content: 'Alice is here, and this is my first post.' },
  { user_id: 4, content: 'Bob here! Glad to be a part of this platform.' }
];

// Create Posts
const createPosts = () => {
  for (let post of posts) {
    const query = `INSERT INTO Post (user_id, content) VALUES (?, ?)`;

    db.run(query, [post.user_id, post.content], (err) => {
      if (err) {
        console.error(`Error creating post for user ${post.user_id}: ` + err.message);
      } else {
        console.log(`Post for user ${post.user_id} created successfully.`);
      }
    });
  }
};

// Dummy Likes Data
const likes = [
  { user_id: 2, post_id: 1 },
  { user_id: 3, post_id: 1 },
  { user_id: 4, post_id: 2 },
  { user_id: 1, post_id: 3 },
  { user_id: 2, post_id: 3 },
  { user_id: 4, post_id: 4 }
];

// Create Likes
const createLikes = () => {
  for (let like of likes) {
    const query = `INSERT INTO Likes (user_id, post_id) VALUES (?, ?)`;

    db.run(query, [like.user_id, like.post_id], (err) => {
      if (err) {
        console.error(`Error creating like from user ${like.user_id} for post ${like.post_id}: ` + err.message);
      } else {
        console.log(`User ${like.user_id} liked post ${like.post_id} successfully.`);
      }
    });
  }
};

// Run the functions to populate the database
createUsers().then(() => {
  createPosts();
  createLikes();
});
