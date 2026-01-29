import sqlite3, hashlib

conn = sqlite3.connect("game.db")
cur = conn.cursor()

username = "Mpouransari"
password = "Mars2004"  # پسورد دلخواه
hashed = hashlib.sha256(password.encode()).hexdigest()
is_superadmin = 1

cur.execute("INSERT INTO admins (username, password, is_superadmin) VALUES (?,?,?)",
            (username, hashed, is_superadmin))
conn.commit()
conn.close()