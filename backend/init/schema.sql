-- User table
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table for tracking student interactions
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL, -- e.g., 'viewed', 'completed', 'asked_ai', etc.
    content_type TEXT NOT NULL, -- e.g., 'lesson', 'quiz', 'ai', etc.
    content_id TEXT, -- id of the content interacted with
    metadata TEXT, -- optional JSON for extra data
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id)
);
