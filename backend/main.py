import os
from flask import Flask, send_from_directory, g, jsonify
import sqlite3
from collections import defaultdict
from datetime import datetime

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
        "activity_timeline": activityTimeline,
        "student_radar": studentRadar,
        "student_profiles": profiles,
    })

@app.errorhandler(404)
def not_found(e):
    # Serve index.html for any non-API, non-static route
    path = getattr(e, 'description', '')
    if not str(path).startswith('/api') and not str(path).startswith('/static') and not str(path).startswith('/assets'):
        return app.send_static_file('index.html')
    return '404 Not Found', 404

if not os.path.exists(DATABASE):
    init_db()