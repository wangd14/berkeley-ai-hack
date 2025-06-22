import os
from flask import Flask, send_from_directory, g, jsonify, request
from flask_cors import CORS
import sqlite3
import hashlib
import secrets
from passlib.context import CryptContext
import jwt
import datetime
from typing import Optional
from collections import defaultdict

DATABASE = 'database.db'

app = Flask(__name__, static_folder="dist", static_url_path="/")
CORS(app)

SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('init/schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/api/teacher-dashboard")
def teacher_dashboard():
    db = get_db()
    # Total students
    total_students = db.execute("SELECT COUNT(*) FROM user").fetchone()[0] - 1
    # Average score (across all interactions with correctness)
    total_correct = db.execute("SELECT SUM(correct_answers) FROM courses_stats").fetchone()[0] or 0
    total_questions = db.execute("SELECT SUM(total_questions) FROM courses_stats").fetchone()[0] or 0
    average_score = int((total_correct / total_questions) * 100) if total_questions > 0 else 0
    # Active subjects (distinct course in courses_stats with activity)
    active_subjects = db.execute("SELECT COUNT(DISTINCT course) FROM courses_stats WHERE total_questions > 0").fetchone()[0]
    # Need attention: students with <60% correctness
    need_attention = db.execute("SELECT COUNT(DISTINCT student_id) FROM (SELECT student_id, SUM(correct_answers)*1.0/SUM(total_questions) as avg_corr FROM courses_stats GROUP BY student_id HAVING avg_corr < 0.6)").fetchone()[0]

    # Topic Difficulty: correctness rate per topic
    topic_difficulty = [
        {"topic": row[0], "correctness": int((row[1] / row[2]) * 100) if row[2] > 0 else 0}
        for row in db.execute("SELECT topic, SUM(correct_answers), SUM(total_questions) FROM courses_stats GROUP BY topic").fetchall()
    ]
    
    # Engagement Heatmap: interactions per topic per day (still from student_interactions)
    heatmap_query = db.execute("SELECT topic_id, strftime('%w', timestamp) as day, COUNT(*) FROM student_interactions GROUP BY topic_id, day")
    heatmap_data = defaultdict(lambda: {"Mon":0,"Tue":0,"Wed":0,"Thu":0,"Fri":0})
    day_map = {"1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri"}
    for topic, day, count in heatmap_query.fetchall():
        if day in day_map:
            heatmap_data[topic][day_map[day]] = count
    engagement_heatmap = [{"topic": topic, **days} for topic, days in heatmap_data.items()]

    # Activity Timeline: recent activity from courses_stats (most recent completions)
    activityTimeline = []
    activity_query = db.execute('''
        SELECT u.name, c.course, c.subcourse, c.topic, c.timestamp
        FROM courses_stats c
        JOIN user u ON c.student_id = u.id
        ORDER BY c.timestamp DESC
        LIMIT 30
    ''')
    for row in activity_query.fetchall():
        activityTimeline.append({
            "student_name": row[0],
            "course": row[1],
            "subcourse": row[2],
            "topic": row[3],
            "timestamp": row[4]
        })

    # Per-Student Progress (Radar): mastery per topic for each student from courses_stats
    radar_query = db.execute("SELECT topic, SUM(correct_answers)*1.0/SUM(total_questions) as mastery FROM courses_stats GROUP BY topic")
    studentRadar = []
    for row in radar_query.fetchall():
        studentRadar.append({"subject": row[0], "Student": int(row[1]*100) if row[1] is not None else 0, "ClassAvg": int(row[1]*100) if row[1] is not None else 0})

    # Student Profiles: mastery, recent activity, at-risk (still from student_interactions)
    profiles = []
    # Exclude teacher (is_teacher=1)
    student_rows = db.execute("SELECT id, name FROM user WHERE is_teacher=0").fetchall()
    for student_id, name in student_rows:
        mastery_row = db.execute("SELECT SUM(correct_answers)*1.0/SUM(total_questions) FROM courses_stats WHERE student_id = ?", (student_id,)).fetchone()
        mastery = int(mastery_row[0]*100) if mastery_row and mastery_row[0] is not None else 0
        recent_row = db.execute("SELECT question_type, timestamp FROM student_interactions WHERE student_id = ? ORDER BY timestamp DESC LIMIT 1", (student_id,)).fetchone()
        recent = recent_row[0] if recent_row else "-"
        at_risk = mastery < 60
        profiles.append({"name": name, "mastery": mastery, "recent": recent, "atRisk": at_risk})

    return jsonify({
        "total_students": total_students,
        "average_score": average_score,
        "active_subjects": active_subjects,
        "need_attention": need_attention,
        "topic_difficulty": topic_difficulty,
        "engagement_heatmap": engagement_heatmap,
        "activityTimeline": activityTimeline,
        "studentRadar": studentRadar,
        "profiles": profiles
    })

# In-memory token store (for demo only)
token_store = {}

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(password, hashed):
    return hash_password(password) == hashed

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.form or request.json
    username = data.get("username")
    password = data.get("password")
    name = data.get("name", "Student")
    is_teacher = 0  # Force all signups to be students
    if not username or not password:
        return jsonify({"detail": "Username and password required"}), 400
    # Check if username already exists
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM user WHERE username = ?", (username,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"detail": "Username already exists"}), 400
    hashed = pwd_context.hash(password)
    cursor.execute(
        "INSERT INTO user (username, password, is_teacher, name) VALUES (?, ?, ?, ?)",
        (username, hashed, is_teacher, name)
    )
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return jsonify({"message": "User created", "is_teacher": False, "student_id": user_id}), 201

def get_user(username):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT username, password, is_teacher FROM user WHERE username=?", (username,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"username": row[0], "password": row[1], "is_teacher": bool(row[2])}
    return None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username, password):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data, expires_delta=None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    # Print for debug
    print("JWT payload:", to_encode)
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print("JWT token:", encoded_jwt)
    return encoded_jwt

@app.route("/api/login", methods=["POST"])
def login():
    data = request.form or request.json
    username = data.get("username")
    password = data.get("password")
    user = authenticate_user(username, password)
    if not user:
        return jsonify({"detail": "Incorrect username or password"}), 400
    # Always fetch fresh user info from DB
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, is_teacher FROM user WHERE username=?", (username,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({"detail": "User not found after login"}), 400
    user_info = {"id": row[0], "username": row[1], "is_teacher": bool(row[2] == 1 or row[2] == True)}
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        {"sub": user_info["username"], "is_teacher": user_info["is_teacher"]}, expires_delta=access_token_expires
    )
    return jsonify({"access_token": access_token, "token_type": "bearer", "is_teacher": user_info["is_teacher"], "student_id": user_info["id"]})

@app.route('/api/course-stats/complete-question', methods=['POST'])
def complete_question():
    data = request.get_json() or request.form
    student_id = data.get('student_id')
    course = data.get('course')
    subcourse = data.get('subcourse')
    topic = data.get('topic')
    correct = data.get('correct')
    if not student_id or not course or not subcourse or not topic or correct is None:
        return jsonify({'error': 'Missing required fields'}), 400
    db = get_db()
    row = db.execute(
        'SELECT * FROM courses_stats WHERE student_id = ? AND course = ? AND subcourse = ? AND topic = ?',
        (student_id, course, subcourse, topic)
    ).fetchone()
    if row:
        db.execute(
            '''UPDATE courses_stats SET 
                completed_questions = completed_questions + 1,
                total_questions = total_questions + 1,
                correct_answers = correct_answers + ?,
                incorrect_answers = incorrect_answers + ?,
                timestamp = CURRENT_TIMESTAMP
            WHERE student_id = ? AND course = ? AND subcourse = ? AND topic = ?''',
            (1 if correct else 0, 0 if correct else 1, student_id, course, subcourse, topic)
        )
    else:
        db.execute(
            '''INSERT INTO courses_stats (student_id, course, subcourse, topic, completed_questions, total_questions, correct_answers, incorrect_answers, timestamp) VALUES (?, ?, ?, ?, 1, 1, ?, ?, CURRENT_TIMESTAMP)''',
            (student_id, course, subcourse, topic, 1 if correct else 0, 0 if correct else 1)
        )
    db.commit()
    return jsonify({'success': True})

@app.route('/api/course-stats', methods=['GET'])
def get_course_stats():
    student_id = request.args.get('student_id')
    course = request.args.get('course')
    topic = request.args.get('topic')
    if not student_id or not course or not topic:
        return jsonify({'error': 'Missing required query params'}), 400
    db = get_db()
    row = db.execute(
        'SELECT * FROM courses_stats WHERE student_id = ? AND course = ? AND topic = ?',
        (student_id, course, topic)
    ).fetchone()
    if row:
        columns = [desc[0] for desc in db.execute('PRAGMA table_info(courses_stats)')]
        result = dict(zip(columns, row))
        return jsonify(result)
    else:
        return jsonify({})

if not os.path.exists(DATABASE):
    init_db()

# Ensure default teacher account exists with hashed password
import os

def create_teacher_account():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    teacher_username = "teacher"
    teacher_password = "teacherpassword"  # Change as needed
    teacher_is_teacher = 1
    teacher_name = "Teacher"
    # Check if teacher exists
    cursor.execute("SELECT id FROM user WHERE username = ?", (teacher_username,))
    if not cursor.fetchone():
        hashed = pwd_context.hash(teacher_password)
        cursor.execute(
            "INSERT INTO user (username, password, is_teacher, name) VALUES (?, ?, ?, ?)",
            (teacher_username, hashed, teacher_is_teacher, teacher_name)
        )
        conn.commit()
    conn.close()

create_teacher_account()

if __name__ == "__main__":
    app.run(debug=True)