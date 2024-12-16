const sqlite3 = require('sqlite3').verbose();

// Database connection
const db = new sqlite3.Database('./Social_Media.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Database connection error: ' + err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
  
    // Enable foreign key support
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error('Error enabling foreign key constraints: ' + err.message);
      } else {
        console.log('Foreign key constraints are enabled.');
      }
    });

  // Create tables one by one
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        profile_pic_url TEXT,
        bio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.run(createUserTable, (err) => {
    if (err) {
      console.error('Error creating User table: ' + err.message);
      return;
    }
    console.log('User table created successfully.');
  });

  const createPostTable = `
    CREATE TABLE IF NOT EXISTS Post (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
    );
  `;

  db.run(createPostTable, (err) => {
    if (err) {
      console.error('Error creating Post table: ' + err.message);
      return;
    }
    console.log('Post table created successfully.');
  });

  const createCommentTable = `
    CREATE TABLE IF NOT EXISTS Comment (
        comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
    );
  `;
  
  db.run(createCommentTable, (err) => {
    if (err) {
      console.error('Error creating Comment table: ' + err.message);
      return;
    }
    console.log('Comment table created successfully.');
  });

  const createLikesTable = `
    CREATE TABLE IF NOT EXISTS Likes (
        like_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
    );
  `;

  db.run(createLikesTable, (err) => {
    if (err) {
      console.error('Error creating Likes table: ' + err.message);
      return;
    }
    console.log('Likes table created successfully.');
  });

  const createFollowTable = `
    CREATE TABLE IF NOT EXISTS Follow (
        follow_id INTEGER PRIMARY KEY AUTOINCREMENT,
        follower_id INTEGER NOT NULL,
        followed_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (follower_id) REFERENCES User(user_id) ON DELETE CASCADE,
        FOREIGN KEY (followed_id) REFERENCES User(user_id) ON DELETE CASCADE,
        UNIQUE (follower_id, followed_id)
    );
  `;
  
  db.run(createFollowTable, (err) => {
    if (err) {
      console.error('Error creating Follow table: ' + err.message);
      return;
    }
    console.log('Follow table created successfully.');
  });
});

// Export the db for use in other files
module.exports = db;
