const db = require('../config/db'); 

const bcrypt = require('bcryptjs');


// Dummy Data (as defined in your script)
const users = [
  { username: 'john_doe1234', email: 'john.doe1234@example.com', password: 'password123' },
  { username: 'jane_smith1234', email: 'jane.smith1234@example.com', password: 'password123' },
  { username: 'alice_wonder', email: 'alice.wonder1234@example.com', password: 'password123' },
  { username: 'bob_brown', email: 'bob.brown1234@example.com', password: 'password123' },
];

// Dummy Posts Data
const posts = [
  { user_id: 1, content: 'This is John\'s first post.' },
  { user_id: 2, content: 'Hello from Jane1233! This is my first post.' },
  { user_id: 3, content: 'Alice is here1233, and this is my first post.' },
  { user_id: 4, content: 'Bob here! Glad to be a part of this platform.' }
];

// Dummy Likes Data
const likes = [
  { user_id: 2, post_id: 1 },
  { user_id: 3, post_id: 1 },
  { user_id: 4, post_id: 2 },
  { user_id: 1, post_id: 3 },
  { user_id: 2, post_id: 3 },
  { user_id: 4, post_id: 4 }
  
];

// Function to create a user with a hashed password
const createUser = (user) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
      if (err) {
        return reject(err);
      }

      const query = `INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?)`;
      db.run(query, [user.username, user.email, hashedPassword], function (err) {
        if (err) {
          reject(`Error creating user ${user.username}: ` + err.message);
        } else {
          resolve(`User ${user.username} created successfully.`);
        }
      });
    });
  });
};

// Function to create posts
const createPost = (post) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Post (user_id, content) VALUES (?, ?)`;
    db.run(query, [post.user_id, post.content], function (err) {
      if (err) {
        reject(`Error creating post for user ${post.user_id}: ` + err.message);
      } else {
        resolve(`Post for user ${post.user_id} created successfully.`);
      }
    });
  });
};

// Function to create likes
const createLike = (like) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Likes (user_id, post_id) VALUES (?, ?)`;
    db.run(query, [like.user_id, like.post_id], function (err) {
      if (err) {
        reject(`Error creating like from user ${like.user_id} for post ${like.post_id}: ` + err.message);
      } else {
        resolve(`User ${like.user_id} liked post ${like.post_id} successfully.`);
      }
    });
  });
};

// Create Users
const createUsers = async () => {
  for (let user of users) {
    try {
      const result = await createUser(user);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
};

// Create Posts
const createPosts = async () => {
  for (let post of posts) {
    try {
      const result = await createPost(post);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
};

// Create Likes
const createLikes = async () => {
  for (let like of likes) {
    try {
      const result = await createLike(like);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
};

// Function to populate the database
const populateDatabase = async () => {
  try {
    await createUsers();
    await createPosts();
    await createLikes();
    console.log('Database populated successfully!');
  } catch (error) {
    console.error("Error populating database: ", error);
  } finally {
    // Ensure that you are not closing the connection here if it's used elsewhere
    // db.close(); // Close the database connection only if needed
  }
};

// Run the population process
populateDatabase();
