-- User table
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_teacher INTEGER DEFAULT 0, -- 0 for student, 1 for teacher
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student-AI interaction log for detailed analytics
CREATE TABLE IF NOT EXISTS student_interactions (
    interaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    student_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    lesson_id TEXT,
    topic_id TEXT,
    question_id TEXT,
    question_type TEXT, -- e.g., 'socratic', 'exercise', 'explanation_request'
    student_input TEXT,
    ai_response TEXT,
    hint_requested BOOLEAN,
    hint_level INTEGER, -- e.g., 1=mild, 3=direct
    response_correctness TEXT, -- 'correct', 'incorrect', 'partial', 'skipped', 'not_applicable'
    attempts_on_question INTEGER,
    time_to_respond_seconds INTEGER,
    FOREIGN KEY(student_id) REFERENCES user(id)
);

-- Indexes for analytics performance
CREATE INDEX IF NOT EXISTS idx_student_interactions_student_id ON student_interactions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_interactions_lesson_id ON student_interactions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_interactions_topic_id ON student_interactions(topic_id);
CREATE INDEX IF NOT EXISTS idx_student_interactions_timestamp ON student_interactions(timestamp);
