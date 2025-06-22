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
    total_students = db.execute("SELECT COUNT(*) FROM user").fetchone()[0]
    # Average score (across all interactions with correctness)
    avg_score_row = db.execute("SELECT AVG(CASE WHEN response_correctness = 'correct' THEN 1 ELSE 0 END)*100 FROM student_interactions").fetchone()
    average_score = int(avg_score_row[0]) if avg_score_row and avg_score_row[0] is not None else 0
    # Active subjects (distinct lesson_id)
    active_subjects = db.execute("SELECT COUNT(DISTINCT lesson_id) FROM student_interactions").fetchone()[0]
    # Need attention: students with <60% correctness
    need_attention = db.execute("SELECT COUNT(DISTINCT student_id) FROM (SELECT student_id, AVG(CASE WHEN response_correctness = 'correct' THEN 1 ELSE 0 END) as avg_corr FROM student_interactions GROUP BY student_id HAVING avg_corr < 0.6)").fetchone()[0]

    # Topic Difficulty: correctness rate per topic
    topic_difficulty = [
        {"topic": row[0], "correctness": int(row[1]*100) if row[1] is not None else 0}
        for row in db.execute("SELECT topic_id, AVG(CASE WHEN response_correctness = 'correct' THEN 1 ELSE 0 END) FROM student_interactions GROUP BY topic_id").fetchall()
    ]

    # Engagement Heatmap: interactions per topic per day
    heatmap_query = db.execute("SELECT topic_id, strftime('%w', timestamp) as day, COUNT(*) FROM student_interactions GROUP BY topic_id, day")
    heatmap_data = defaultdict(lambda: {"Mon":0,"Tue":0,"Wed":0,"Thu":0,"Fri":0})
    day_map = {"1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri"}
    for topic, day, count in heatmap_query.fetchall():
        if day in day_map:
            heatmap_data[topic][day_map[day]] = count
    engagement_heatmap = [{"topic": topic, **days} for topic, days in heatmap_data.items()]

    # Activity Timeline: interactions per day
    timeline_query = db.execute("SELECT strftime('%w', timestamp) as day, COUNT(*) FROM student_interactions GROUP BY day")
    timeline_map = {"1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri"}
    activityTimeline = []
    for day, count in timeline_query.fetchall():
        if day in timeline_map:
            activityTimeline.append({"day": timeline_map[day], "interactions": count})

    # Per-Student Progress (Radar): mastery per subject for a sample student and class avg
    radar_query = db.execute("SELECT topic_id, AVG(CASE WHEN response_correctness = 'correct' THEN 1 ELSE 0 END) as avg_corr FROM student_interactions GROUP BY topic_id")
    studentRadar = []
    for row in radar_query.fetchall():
        studentRadar.append({"subject": row[0], "Student": int(row[1]*100) if row[1] is not None else 0, "ClassAvg": int(row[1]*100) if row[1] is not None else 0})

    # Student Profiles: mastery, recent activity, at-risk
    profiles = []
    student_rows = db.execute("SELECT id, name FROM user").fetchall()
    for student_id, name in student_rows:
        mastery_row = db.execute("SELECT AVG(CASE WHEN response_correctness = 'correct' THEN 1 ELSE 0 END) FROM student_interactions WHERE student_id = ?", (student_id,)).fetchone()
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
    print(password, hashed)
    cursor.execute(
        "INSERT INTO user (username, password, is_teacher, name) VALUES (?, ?, ?, ?)",
        (username, hashed, is_teacher, name)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "User created", "is_teacher": False}), 201

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
    cursor.execute("SELECT username, is_teacher FROM user WHERE username=?", (username,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({"detail": "User not found after login"}), 400
    user_info = {"username": row[0], "is_teacher": bool(row[1] == 1 or row[1] == True)}
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        {"sub": user_info["username"], "is_teacher": user_info["is_teacher"]}, expires_delta=access_token_expires
    )
    return jsonify({"access_token": access_token, "token_type": "bearer", "is_teacher": user_info["is_teacher"]})

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