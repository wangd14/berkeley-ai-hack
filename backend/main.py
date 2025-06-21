import os
from flask import Flask, send_from_directory, g, jsonify
import sqlite3

DATABASE = 'database.db'

app = Flask(__name__, static_folder="dist", static_url_path="/")

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
    # Get total students
    total_students = db.execute("SELECT COUNT(*) FROM user").fetchone()[0]
    # Get average score (dummy value for now, replace with real logic if available)
    average_score = 83
    # Get active subjects (dummy value for now)
    active_subjects = 5
    # Get need attention (dummy value for now)
    need_attention = 3
    # Example subject performance (replace with real queries if available)
    subject_performance = [
        {"subject": "Math", "average": 82},
        {"subject": "Science", "average": 75},
        {"subject": "English", "average": 88},
        {"subject": "History", "average": 79},
        {"subject": "Art", "average": 91},
    ]
    # Example weekly progress (replace with real queries if available)
    weekly_progress = [
        {"day": "Mon", "completed": 45},
        {"day": "Tue", "completed": 52},
        {"day": "Wed", "completed": 49},
        {"day": "Thu", "completed": 63},
        {"day": "Fri", "completed": 58},
    ]
    # Example assignment status (replace with real queries if available)
    assignment_status = [
        {"name": "Completed", "value": 68},
        {"name": "In Progress", "value": 22},
        {"name": "Not Started", "value": 10},
    ]
    # Example recent activity (replace with real queries if available)
    recent_activity = [
        {"student": "Emma Thompson", "action": "Completed Math Quiz", "score": "92%", "time": "10 mins ago"},
        {"student": "James Wilson", "action": "Started Science Module", "score": "-", "time": "25 mins ago"},
        {"student": "Sophia Chen", "action": "Submitted English Essay", "score": "Pending", "time": "1 hour ago"},
        {"student": "Lucas Garcia", "action": "Completed Practice Problems", "score": "88%", "time": "2 hours ago"},
    ]
    return jsonify({
        "total_students": total_students,
        "average_score": average_score,
        "active_subjects": active_subjects,
        "need_attention": need_attention,
        "subject_performance": subject_performance,
        "weekly_progress": weekly_progress,
        "assignment_status": assignment_status,
        "recent_activity": recent_activity,
    })

if not os.path.exists(DATABASE):
    init_db()