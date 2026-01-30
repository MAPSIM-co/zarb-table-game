from fastapi import FastAPI, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sqlite3, json, random, os, hashlib
 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


# ---------- DATABASE ----------
conn = sqlite3.connect("game.db", check_same_thread=False)
cur = conn.cursor()

# جدول نتایج
cur.execute("""
CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player TEXT,
    score INTEGER
)
""")

# جدول جواب‌ها
cur.execute("""
CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player TEXT,
    question TEXT,
    answer INTEGER,
    correct INTEGER
)
""")

# جدول بازیکن‌ها
cur.execute("""
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
)
""")

# جدول ادمین‌ها
cur.execute("""
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    is_superadmin INTEGER
)
""")

# جدول جواب مود تمرین
cur.execute("""
CREATE TABLE IF NOT EXISTS practice_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player TEXT,
    question TEXT,
    answer INTEGER,
    correct INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()

# ---------- مغز سیستم تمرین ----------
def generate_practice_questions(player, families, total):
    #print("GENERATE QUESTIONS CALLED:", player, families, total)
    selected = []

    wrong_limit = int(total * 0.7)
    review_limit = total - wrong_limit

    try:
        # سوال‌هایی که بیشترین غلط را داشته
        cur.execute("""
            SELECT question
            FROM answers
            WHERE LOWER(player) = ?
              AND correct = 0
              AND answer != -1
              AND SUBSTR(question,1,1) IN ({})
            GROUP BY question
            ORDER BY COUNT(*) DESC
            LIMIT ?
        """.format(",".join("?"*len(families))),
        tuple([player.lower()] + [str(f) for f in families] + [wrong_limit]))
        wrong_qs = [r[0] for r in cur.fetchall()]

        # سوال‌هایی که درست بوده (مرور)
        cur.execute("""
            SELECT question
            FROM answers
            WHERE LOWER(player) = ?
              AND correct = 1
              AND SUBSTR(question,1,1) IN ({})
            GROUP BY question
            ORDER BY COUNT(*) DESC
            LIMIT ?
        """.format(",".join("?"*len(families))),
        tuple([player.lower()] + [str(f) for f in families] + [review_limit]))
        review_qs = [r[0] for r in cur.fetchall()]

    except Exception as e:
        #print("ERROR in fetching wrong/review questions:", e)
        wrong_qs, review_qs = [], []

    #print("WRONG_QS:", wrong_qs)
    #print("REVIEW_QS:", review_qs)

    selected = wrong_qs + review_qs

    # اگر تعداد سوال‌ها کمتر از total است → تولید سوال از خانواده انتخاب شده
    while len(selected) < total:
        f = random.choice(families)
        b = random.randint(1, 9)
        selected.append(f"{f}x{b}")

    random.shuffle(selected)

    final_questions = []
    for q in selected[:total]:
        try:
            a, b = q.lower().replace(" ", "").split("x")
            final_questions.append({
                "a": int(a),
                "b": int(b),
                "answer": int(a) * int(b)
            })
        except Exception as e:
            print("ERROR in parsing question:", q, e)

    #print("FINAL QUESTIONS:", final_questions)
    return final_questions

# ---------- START MATCH ----------
@app.post("/practice/start")
async def start_practice(data: dict):
    #print("REQUEST DATA:", data)
    player = data.get("player")
    families = data.get("families", [])
    total = data.get("questions", 10)
    #print("PLAYER:", player, "FAMILIES:", families, "TOTAL:", total)

    if not player:
        raise HTTPException(status_code=400, detail="بازیکن مشخص نشده")

    try:
        questions = generate_practice_questions(player, families, total)
    except Exception as e:
        print("ERROR in generate_practice_questions:", e)
        raise HTTPException(status_code=500, detail="خطا در تولید سوال‌ها")

    game["players"] = [player]
    game["scores"] = {player: 0}
    game["current"] = 0
    game["count"] = 0
    game["finished"] = False
    game["questions"] = questions
    game["max_questions"] = len(questions)
    game["time"] = data.get("time", 20)

    response = {"status": "practice_started", "questions": questions}
    #print("RESPONSE DATA:", response)
    return response

# ---------- REWARDS ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REWARD_FILE = os.path.join(BASE_DIR, "static", "rewards.json")

with open(REWARD_FILE, encoding="utf-8") as f:
    all_rewards = json.load(f)

# ---------- GAME STATE ----------
game = {
    "players": [],
    "scores": {},
    "current": 0,
    "families": [],
    "time": 20,
    "max_questions": 10,
    "count": 0,
    "finished": False,
    "questions": []
}

# ---------- START GAME ----------
@app.post("/start")
async def start_game(data: dict):
    game["players"] = data.get("players", [])
    game["families"] = data.get("families", [])
    game["time"] = data.get("time", 20)
    game["max_questions"] = data.get("questions", 10)
    game["count"] = 0
    game["finished"] = False
    game["scores"] = {p: 0 for p in game["players"]}
    game["current"] = 0

    # ---------- تولید سوال‌ها از خانواده انتخابی ----------
    questions = []
    if not game["families"]:
        game["questions"] = []
    else:
        while len(questions) < game["max_questions"]:
            for f in game["families"]:
                for i in range(1, 10):
                    questions.append({"a": f, "b": i, "answer": f*i})
                    if len(questions) >= game["max_questions"]:
                        break
                if len(questions) >= game["max_questions"]:
                    break

    random.shuffle(questions)
    game["questions"] = questions[:game["max_questions"]]

    return {"status": "started"}

# ---------- GET QUESTION ----------
@app.get("/question")
async def get_question():
    if game["finished"] or not game["questions"]:
        return {"end": True}

    if game["count"] >= game["max_questions"]:
        game["finished"] = True

        for p, s in game["scores"].items():
            cur.execute(
                "INSERT INTO results (player, score) VALUES (?,?)",
                (p, s)
            )
        conn.commit()

        max_score = max(game["scores"].values()) if game["scores"] else 0
        winners = [p for p, s in game["scores"].items() if s == max_score]

        return {
            "end": True,
            "scores": game["scores"],
            "winner": winners[0] if len(winners) == 1 else None,
            "tie": winners if len(winners) > 1 else None,
            "rewards": all_rewards
        }

    q = game["questions"][game["count"]]
    game["count"] += 1

    return {
        "end": False,
        "question": f"{q['a']}x{q['b']}",
        "player": game["players"][game["current"]] if game["players"] else "",
        "number": game["count"],
        "total": game["max_questions"],
        "scores": game["scores"],
        "time": game["time"]
    }

# ---------- ANSWER ----------
@app.post("/answer")
async def submit_answer(data: dict):
    if game["finished"]:
        return {"error": "Game already finished"}

    player = data.get("player")
    question = data.get("question")   # مثل: 2x7
    user_answer = data.get("answer")

    if user_answer is None:
        user_answer = -1
    else:
        user_answer = int(user_answer)

    # محاسبه جواب صحیح از خود سوال
    correct = 0
    try:
        a, b = question.lower().replace(" ", "").split("x")
        correct_answer = int(a) * int(b)
        correct = int(user_answer == correct_answer)
    except:
        correct = 0

    # ذخیره در دیتابیس
    cur.execute(
        "INSERT INTO answers (player, question, answer, correct) VALUES (?,?,?,?)",
        (player, question, user_answer, correct)
    )
    conn.commit()

    # امتیاز
    if correct == 1 and player in game["scores"]:
        game["scores"][player] += 1

    # بازیکن بعدی
    if game["players"]:
        game["current"] = (game["current"] + 1) % len(game["players"])

    return {
        "correct": bool(correct),
        "scores": game["scores"]
    }

# ---------- FINISH ----------
@app.post("/finish")
async def finish_game(data: dict):
    players = data.get("players", [])
    scores = data.get("scores", {})

    for p in players:
        cur.execute(
            "INSERT INTO results (player, score) VALUES (?,?)",
            (p, scores.get(p, 0))
        )
    conn.commit()

    return {"status": "ok"}


# ---------- REPORT API ----------
@app.get("/api/players")
async def report_players():
    cur.execute("""
        SELECT LOWER(player) as player
        FROM answers
        GROUP BY LOWER(player)
        ORDER BY player
    """)
    rows = cur.fetchall()
    players = [r[0] for r in rows]
    return players

@app.get("/api/wrong/{player}")
async def report_wrong_answers(player: str):
    cur.execute("""
        SELECT question, answer
        FROM answers
        WHERE LOWER(player) = ?
          AND correct = 0
        ORDER BY id DESC
    """, (player.lower(),))
    rows = cur.fetchall()
    return [{"question": q, "answer": a} for q, a in rows]

@app.get("/api/stats/{player}")
async def report_stats(player: str):
    cur.execute("""
        SELECT
            SUM(correct) as correct,
            SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) as wrong
        FROM answers
        WHERE LOWER(player) = ?
    """, (player.lower(),))
    row = cur.fetchone()
    return {
        "correct": row[0] or 0,
        "wrong": row[1] or 0
    }

@app.get("/api/questions-wrong")
async def questions_wrong_stats():
    cur.execute("""
        SELECT question, COUNT(*) as wrong_count
        FROM answers
        WHERE correct = 0
        GROUP BY question
        ORDER BY wrong_count DESC
    """)
    rows = cur.fetchall()
    return [{"question": q, "wrong_count": wc} for q, wc in rows]

@app.get("/api/wrong-stats/{player}")
async def wrong_stats(player: str):
    # سوال‌هایی که بازیکن جواب غلط داده و تعداد هر سوال
    cur.execute("""
        SELECT question, COUNT(*) as wrong_count
        FROM answers
        WHERE LOWER(player) = ?
        AND correct = 0
        AND answer != -1
        GROUP BY question
        ORDER BY wrong_count DESC
    """, (player.lower(),))
    rows = cur.fetchall()
    return [{"question": q, "wrong_count": c} for q, c in rows]

@app.get("/api/right-stats/{player}")
async def right_stats(player: str):
    cur.execute("""
        SELECT question, COUNT(*) as right_count
        FROM answers
        WHERE LOWER(player) = ?
          AND correct = 1
        GROUP BY question
        ORDER BY right_count DESC
    """, (player.lower(),))
    rows = cur.fetchall()
    return [{"question": q, "right_count": c} for q, c in rows]

# ---------- PRACTICE REPORT API ----------

# لیست بازیکن‌های تمرین
@app.get("/api/practice-players")
async def practice_players():
    cur.execute("""
        SELECT LOWER(player) as player
        FROM practice_answers
        GROUP BY LOWER(player)
        ORDER BY player
    """)
    rows = cur.fetchall()
    players = [r[0] for r in rows]
    return players

# جواب‌های غلط تمرین یک بازیکن
@app.get("/api/practice/wrong/{player}")
async def practice_wrong_answers(player: str):
    cur.execute("""
        SELECT question, answer
        FROM practice_answers
        WHERE LOWER(player) = ?
          AND correct = 0
        ORDER BY id DESC
    """, (player.lower(),))
    rows = cur.fetchall()
    return [{"question": q, "answer": a} for q, a in rows]

# آمار درست و غلط تمرین یک بازیکن
@app.get("/api/practice/stats/{player}")
async def practice_stats(player: str):
    cur.execute("""
        SELECT
            SUM(correct) as correct,
            SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) as wrong
        FROM practice_answers
        WHERE LOWER(player) = ?
    """, (player.lower(),))
    row = cur.fetchone()
    return {
        "correct": row[0] or 0,
        "wrong": row[1] or 0
    }

# سوال‌هایی که بیشترین غلط را در تمرین داشته‌اند
@app.get("/api/practice/questions-wrong")
async def practice_questions_wrong():
    cur.execute("""
        SELECT question, COUNT(*) as wrong_count
        FROM practice_answers
        WHERE correct = 0
        GROUP BY question
        ORDER BY wrong_count DESC
    """)
    rows = cur.fetchall()
    return [{"question": q, "wrong_count": wc} for q, wc in rows]

# آمار تعداد هر سوال غلط برای یک بازیکن در تمرین
@app.get("/api/practice/wrong-stats/{player}")
async def practice_wrong_stats(player: str):
    cur.execute("""
        SELECT question, COUNT(*) as wrong_count
        FROM practice_answers
        WHERE LOWER(player) = ?
          AND correct = 0
          AND answer != -1
        GROUP BY question
        ORDER BY wrong_count DESC
    """, (player.lower(),))
    rows = cur.fetchall()
    return [{"question": q, "wrong_count": c} for q, c in rows]

# آمار تعداد هر سوال درست برای یک بازیکن در تمرین
@app.get("/api/practice/right-stats/{player}")
async def practice_right_stats(player: str):
    cur.execute("""
        SELECT question, COUNT(*) as right_count
        FROM practice_answers
        WHERE LOWER(player) = ?
          AND correct = 1
        GROUP BY question
        ORDER BY right_count DESC
    """, (player.lower(),))
    rows = cur.fetchall()
    return [{"question": q, "right_count": c} for q, c in rows]

# ---------- ADMIN LOGIN ----------
@app.post("/admin/login")
async def admin_login(username: str = Form(...), password: str = Form(...)):
    cur.execute("SELECT id, password, is_superadmin FROM admins WHERE username = ?", (username,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="نام کاربری یافت نشد")
    admin_id, hashed, is_super = row
    if hashlib.sha256(password.encode()).hexdigest() != hashed:
        raise HTTPException(status_code=401, detail="رمز عبور اشتباه است")
    return {"success": True, "admin_id": admin_id, "is_superadmin": is_super}

# ---------- ADD PLAYER ----------
@app.post("/admin/add-player")
async def add_player(name: str = Form(...)):
    if not name.strip():
        raise HTTPException(status_code=400, detail="نام بازیکن نمی‌تواند خالی باشد")
    try:
        cur.execute("INSERT INTO players (name) VALUES (?)", (name.strip(),))
        conn.commit()
        return {"success": True, "msg": "بازیکن ثبت شد!"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="بازیکن از قبل وجود دارد")
    
# ---------- Load PLAYER ----------
@app.get("/api/load-players")
async def report_players():
    cur.execute("""
        SELECT LOWER(name) as player
        FROM players
        GROUP BY LOWER(name)
        ORDER BY name
    """)
    rows = cur.fetchall()
    players = [r[0] for r in rows]
    return players

# ---------- ADD ADMIN ----------
@app.post("/admin/add-admin")
async def add_admin(
    username: str = Form(...),
    password: str = Form(...),
    is_superadmin: int = Form(0),
    current_admin_id: int = Form(...)
):
    cur.execute("SELECT is_superadmin FROM admins WHERE id=?", (current_admin_id,))
    row = cur.fetchone()
    if not row or row[0] != 1:
        raise HTTPException(status_code=403, detail="فقط ادمین اصلی می‌تواند ادمین اضافه کند")
    hashed = hashlib.sha256(password.encode()).hexdigest()
    try:
        cur.execute(
            "INSERT INTO admins (username, password, is_superadmin) VALUES (?,?,?)",
            (username.strip(), hashed, is_superadmin)
        )
        conn.commit()
        return {"success": True, "msg": "ادمین جدید ثبت شد!"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="ادمین از قبل وجود دارد")
    

# ---------- START PRACTICE ----------
@app.post("/practice/start")
async def start_practice(data: dict):
    player = data.get("player")
    families = data.get("families", [])
    total = data.get("questions", 10)
    if not player:
        raise HTTPException(status_code=400, detail="بازیکن مشخص نشده")
    questions = generate_practice_questions(player, families, total)
    game["players"] = [player]
    game["scores"] = {player: 0}
    game["current"] = 0
    game["count"] = 0
    game["finished"] = False
    game["questions"] = questions
    game["max_questions"] = len(questions)
    game["time"] = data.get("time", 20)
    return {"status": "practice_started", "questions": questions}

# ---------- PRACTICE ANSWER ----------
@app.post("/practice/answer")
async def practice_answer(data: dict):
    player = data.get("player")
    question = data.get("question")
    user_answer = data.get("answer")
    if user_answer is None:
        user_answer = -1
    else:
        user_answer = int(user_answer)
    try:
        a, b = question.lower().split("x")
        correct_answer = int(a) * int(b)
        correct = int(user_answer == correct_answer)
    except:
        correct = 0
        correct_answer = None
    cur.execute("INSERT INTO practice_answers (player, question, answer, correct) VALUES (?,?,?,?)",
                (player, question, user_answer, correct))
    conn.commit()
    if correct == 1 and player in game["scores"]:
        game["scores"][player] += 1
    return {"correct": bool(correct), "correct_answer": correct_answer, "scores": game["scores"]}

# ---------- STATIC FILES ----------
app.mount("/admin", StaticFiles(directory="admin"), name="admin")
app.mount("/report-ui", StaticFiles(directory="report-ui"), name="report-ui")
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/dashboard", StaticFiles(directory="Dashboard"), name="dashboard")
app.mount("/practice", StaticFiles(directory="practice"), name="practice")
