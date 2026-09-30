# Cross Table Game

An educational multiplication table game for **practice, training, and competition**.

Zarb Table Game is a lightweight web application built with:

- Python
- FastAPI
- Uvicorn
- SQLite
- HTML
- CSS
- JavaScript

The application can run locally on **Linux, macOS, and Windows**, or be deployed on a **Linux VPS** using `systemd`.

---

## Language

- 🇮🇷 [فارسی](./README_FA.md)

---

# 🚀 Demo

Live demo:

**[Cross Table](http://zarb.mapsim.shop:8000/dashboard/index.html)**

> The demo URL is only an example deployment.
>
> Cross Table Game does not require this domain and can run on any server, VPS, or local computer.

---

# 💡 Features

- Multiplication table practice from 1 to 9
- Timed quizzes
- Multiplayer/class competition
- Player scoring
- Player progress tracking
- Game result tracking
- Practice mode
- Wrong-answer review
- Practice statistics
- Question statistics
- Admin panel
- Player management
- Admin management
- SQLite database
- REST API
- Linux `systemd` service support
- Cross-platform development support:
  - Linux
  - macOS
  - Windows

---

# 🛠️ Technology Stack

- Python 3.10+
- FastAPI
- Uvicorn
- SQLite
- HTML
- CSS
- JavaScript

The application does **not** require a separate database server.

SQLite is used as the application database.

The database file is:

```text
game.db
```

---

# 📁 Project Structure

The main project structure is:

```text
zarb-table-game/
│
├── main.py
├── add_admin.py
├── setup_service.sh
├── requirements.txt
├── game.db
│
├── static/
│   ├── index.html
│   └── rewards.json
│
├── admin/
│   └── panel.html
│
├── Dashboard/
│   └── index.html
│
├── practice/
│   └── ...
│
├── report-ui/
│   └── ...
│
├── README.md
├── README_FA.md
└── LICENSE.txt
```

> `game.db` is normally created automatically by the application and should not be committed to GitHub.

---

## ⚠️ Important: `Dashboard` Directory Name

The physical dashboard directory must be named exactly:

```text
Dashboard/
```

with an uppercase `D`.

It must **not** be:

```text
dashboard/
```

This is especially important on Linux because Linux filesystems are case-sensitive.

### Physical Directory vs. URL

The project intentionally uses different capitalization for the physical directory and the URL path:

| Purpose | Name |
|---|---|
| Physical directory | `Dashboard/` |
| URL path | `/dashboard/` |

The application intentionally maps:

```text
/dashboard/
```

to:

```text
Dashboard/
```

This mapping is defined in `main.py`:

```python
DASHBOARD_DIR = os.path.join(BASE_DIR, "Dashboard")

app.mount(
    "/dashboard",
    StaticFiles(directory=DASHBOARD_DIR),
    name="dashboard"
)
```

Therefore, the correct project structure is:

```text
zarb-table-game/
├── main.py
├── Dashboard/
│   └── index.html
├── admin/
├── practice/
├── report-ui/
└── static/
```

The dashboard can then be accessed through:

```text
http://YOUR_SERVER_IP:8000/dashboard/index.html
```

### ⚠️ Do Not Rename the Directory to Lowercase

Do **not** rename:

```text
Dashboard/
```

to:

```text
dashboard/
```

unless you also change the corresponding path in `main.py`.

The expected configuration is:

```python
DASHBOARD_DIR = os.path.join(BASE_DIR, "Dashboard")
```

together with:

```python
app.mount(
    "/dashboard",
    StaticFiles(directory=DASHBOARD_DIR),
    name="dashboard"
)
```

### If Git Contains the Wrong Capitalization

If the repository ever contains:

```text
dashboard/
```

instead of:

```text
Dashboard/
```

fix the directory name in Git itself.

Do not rely only on manually renaming the directory on the VPS.

Use:

```bash
git mv dashboard dashboard_temp
git mv dashboard_temp Dashboard
git add -A
git commit -m "Fix Dashboard directory casing"
git push
```

Then update the VPS:

```bash
cd ~/zarb-table-game
git pull
```

Verify the directory:

```bash
ls -ld Dashboard
```

The expected directory name is:

```text
Dashboard
```

### Verify the Dashboard After Deployment

After the application is running, test the dashboard locally on the server:

```bash
curl -I http://127.0.0.1:8000/dashboard/index.html
```

A successful response should contain:

```text
HTTP/1.1 200 OK
```

You can then open the dashboard from a browser using:

```text
http://YOUR_SERVER_IP:8000/dashboard/index.html
```

> **Important:** `Dashboard/` is the physical directory name, while `/dashboard/` is the URL path. The difference in capitalization is intentional and must be preserved.

---

# 📦 Installation

There are two main ways to run Zarb Table Game:

1. **Development / local mode**
2. **Linux VPS / production mode with systemd**

If you are new to the project, follow the installation steps in order.

---

# 🐧 Linux VPS Installation

These instructions are suitable for Ubuntu/Debian-based Linux servers.

---

## Step 1 — Update the Operating System

If you are using a normal user account with `sudo`:

```bash
sudo apt update
sudo apt upgrade -y
```

If you are already logged in as `root`:

```bash
apt update
apt upgrade -y
```

---

## Step 2 — Install Git

Check whether Git is installed:

```bash
git --version
```

If Git is not installed:

```bash
sudo apt install -y git
```

For `root`:

```bash
apt install -y git
```

---

## Step 3 — Install Python

Check the installed Python version:

```bash
python3 --version
```

Zarb Table Game is intended for:

```text
Python 3.10+
```

Install Python and the required tools if necessary:

```bash
sudo apt install -y python3 python3-pip python3-venv
```

For `root`:

```bash
apt install -y python3 python3-pip python3-venv
```

Verify:

```bash
python3 --version
pip3 --version
```

---

# Step 4 — Clone the Repository

Choose where you want to install the project.

For example:

```bash
cd ~
git clone https://github.com/MAPSIM-co/zarb-table-game.git
cd zarb-table-game
```

Verify the current directory:

```bash
pwd
```

You should see something similar to:

```text
/root/zarb-table-game
```

Check the project files:

```bash
ls -la
```

---

# Step 5 — Verify the Project Structure

Run:

```bash
ls -ld static admin Dashboard practice report-ui
```

All required directories should exist.

Also check:

```bash
ls -l main.py
ls -l requirements.txt
ls -l setup_service.sh
```

Check the rewards file:

```bash
ls -l static/rewards.json
```

If `Dashboard/` is missing but `dashboard/` exists:

```bash
mv dashboard Dashboard
```

Then verify:

```bash
ls -ld Dashboard
```

The directory must be:

```text
Dashboard
```

---

# Step 6 — Create the Python Virtual Environment

Install the virtual environment package if necessary:

```bash
sudo apt install -y python3-venv
```

Create the virtual environment from the project directory:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Your terminal should now contain:

```text
(venv)
```

For example:

```text
(venv) root@server:~/zarb-table-game#
```

---

# Step 7 — Install Python Dependencies

With the virtual environment activated:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

You can verify the installed packages with:

```bash
pip list
```

---

# Step 8 — Verify `main.py`

Before starting the application, check the Python syntax:

```bash
python -m py_compile main.py
```

If the command returns to the shell without an error, the syntax check passed.

Normally there is no output.

---

# Step 9 — Verify the Application Import

Run:

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

Expected result:

```text
MAIN IMPORT OK
```

If this command fails, fix the reported error before continuing with the production service setup.

---

# 🗄️ Database

Zarb Table Game uses SQLite.

The database file is:

```text
game.db
```

No MySQL, PostgreSQL, or other database server is required.

The application creates the database and its tables when the application initializes if the database does not already exist.

---

## Database Tables

The application uses the following main tables:

| Table | Purpose |
|---|---|
| `players` | Registered players |
| `admins` | Administrator accounts |
| `results` | Completed game results and scores |
| `answers` | Answers submitted during normal games |
| `practice_answers` | Answers submitted during Practice mode |

---

# 🔐 Database Backup

Before deleting, resetting, replacing, or manually modifying database data, create a backup.

From the project directory:

```bash
cp game.db game.db.backup
```

A timestamped backup is preferable:

```bash
cp game.db "game.db.$(date +%Y%m%d-%H%M%S).backup"
```

Example:

```text
game.db.20260930-170000.backup
```

Keep important backups outside the project directory as well if possible.

---

# 🔎 Inspect the Database

The project does not require the `sqlite3` command-line program because Python includes SQLite support.

Activate the virtual environment:

```bash
source venv/bin/activate
```

Start Python:

```bash
python
```

Then:

```python
import sqlite3

conn = sqlite3.connect("game.db")
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print(cursor.fetchall())

conn.close()
```

Exit Python:

```python
exit()
```

---

# 📊 Check Database Record Counts

You can check the number of records in the main tables:

```bash
python - <<'PY'
import sqlite3

conn = sqlite3.connect("game.db")

tables = [
    "admins",
    "players",
    "answers",
    "practice_answers",
    "results",
]

for table in tables:
    count = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    print(f"{table}: {count}")

conn.close()
PY
```

Example output:

```text
admins: 1
players: 4
answers: 25
practice_answers: 10
results: 5
```

---

# ⚠️ Reset Old Game / Report Data

If you want to remove old game and report data but **keep the registered players**, do **not** delete the `players` table.

First create a backup:

```bash
cp game.db "game.db.before-reset.$(date +%Y%m%d-%H%M%S)"
```

Then clear only the historical game data:

```bash
python - <<'PY'
import sqlite3

conn = sqlite3.connect("game.db")

conn.execute("DELETE FROM answers")
conn.execute("DELETE FROM practice_answers")
conn.execute("DELETE FROM results")

conn.commit()
conn.close()

print("Old game/report data cleared.")
print("Players and admins were NOT deleted.")
PY
```

This clears:

```text
answers
practice_answers
results
```

and preserves:

```text
players
admins
```

Verify the result:

```bash
python - <<'PY'
import sqlite3

conn = sqlite3.connect("game.db")

for table in [
    "admins",
    "players",
    "answers",
    "practice_answers",
    "results",
]:
    count = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    print(f"{table}: {count}")

conn.close()
PY
```

After a clean reset, you should see:

```text
admins: <existing admin count>
players: <existing player count>
answers: 0
practice_answers: 0
results: 0
```

> **Never run `DELETE FROM players` if your intention is only to clear old game or report data.**

---

# 🎁 Rewards Configuration

Rewards are stored in:

```text
static/rewards.json
```

Example:

```json
[
    {
        "name": "Chocolate 🍫",
        "desc": "Congratulations! You won a delicious chocolate!"
    },
    {
        "name": "Favorite Snack 🍿",
        "desc": "Choose your favorite snack within the allowed limit."
    },
    {
        "name": "Drink 🥤",
        "desc": "Congratulations! You won a drink."
    }
]
```

You can edit this file with any text editor.

After editing it, validate the JSON:

```bash
python -m json.tool static/rewards.json
```

If the file is valid, Python will output the formatted JSON.

If a JSON syntax error is reported, fix it before using the application.

---

# ▶️ Run the Application Manually

Manual execution is useful for development and troubleshooting.

Activate the virtual environment:

```bash
source venv/bin/activate
```

Start Uvicorn:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The application will listen on port:

```text
8000
```

The `--reload` option is intended for development/testing.

> Do **not** normally use `--reload` in the production `systemd` service.

Stop the server with:

```text
CTRL+C
```

---

# 🌐 Access the Application

Replace `YOUR_SERVER_IP` with the public IP address or hostname of your server.

## Main Game

```text
http://YOUR_SERVER_IP:8000/static/index.html
```

## Admin Panel

```text
http://YOUR_SERVER_IP:8000/admin/panel.html
```

## Dashboard

```text
http://YOUR_SERVER_IP:8000/dashboard/index.html
```

## Practice

```text
http://YOUR_SERVER_IP:8000/practice/
```

## Report UI

```text
http://YOUR_SERVER_IP:8000/report-ui/
```

---

# ℹ️ Why `/` May Return 404

The application does not necessarily define a root `/` route.

Therefore:

```text
http://127.0.0.1:8000/
```

may return:

```json
{"detail":"Not Found"}
```

This does **not** necessarily mean that the application is broken.

The main game interface is:

```text
/static/index.html
```

For example:

```text
http://127.0.0.1:8000/static/index.html
```

---

# 🖥️ Local Installation — macOS

Install Python 3 and Git.

Clone the repository:

```bash
git clone https://github.com/MAPSIM-co/zarb-table-game.git
cd zarb-table-game
```

Create the virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Verify:

```bash
python -m py_compile main.py
```

Start the application:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000
```

Open:

```text
http://127.0.0.1:8000/static/index.html
```

Stop the application:

```text
CTRL+C
```

---

# 🪟 Local Installation — Windows

Open PowerShell.

Clone the repository:

```powershell
git clone https://github.com/MAPSIM-co/zarb-table-game.git
cd zarb-table-game
```

Create the virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Verify:

```powershell
python -m py_compile main.py
```

Start the application:

```powershell
uvicorn main:app --host 127.0.0.1 --port 8000
```

Open:

```text
http://127.0.0.1:8000/static/index.html
```

Stop the application:

```text
CTRL+C
```

---

# 👑 Create an Administrator

The project includes:

```text
add_admin.py
```

With the virtual environment activated:

```bash
python add_admin.py
```

Follow the prompts displayed by the script.

Do not assume a default username or password unless the installed version of `add_admin.py` explicitly provides one.

> Never publish real administrator passwords or other secrets in GitHub.

---

# 👨‍👩‍👧 Player Management

Players are stored in the:

```text
players
```

table inside:

```text
game.db
```

Players can be managed through the Admin panel.

Admin panel:

```text
/admin/panel.html
```

API endpoint:

```text
POST /admin/add-player
```

---

# 👤 Admin Management

Administrator accounts are stored in:

```text
admins
```

inside:

```text
game.db
```

Admin login:

```text
POST /admin/login
```

Add administrator:

```text
POST /admin/add-admin
```

The administrator-management endpoint requires the appropriate permissions.

---

# ⚙️ Linux Production Service

For a Linux VPS, the recommended way to keep the application running continuously is **systemd**.

The repository includes:

```text
setup_service.sh
```

## Important: Run the Script From the Project Directory

The current `setup_service.sh` determines the application directory using the current working directory.

Therefore, **always enter the project directory first**:

```bash
cd ~/zarb-table-game
```

Then make the script executable:

```bash
chmod +x setup_service.sh
```

Run it:

```bash
sudo ./setup_service.sh
```

If you are already logged in as `root`:

```bash
./setup_service.sh
```

The service will be installed as:

```text
zarb-table-game.service
```

The script:

1. Checks that it is running as root.
2. Checks that the virtual environment contains Uvicorn.
3. Creates the systemd service.
4. Reloads systemd.
5. Enables the service.
6. Restarts the service.

You do **not** need to manually run another `systemctl start` immediately after a successful `setup_service.sh` execution.

---

# 🔄 systemd Service Configuration

The service uses Uvicorn without `--reload`.

A typical configuration is:

```ini
[Unit]
Description=Zarb Table Game FastAPI Service
After=network.target

[Service]
User=root
WorkingDirectory=/root/zarb-table-game
ExecStart=/root/zarb-table-game/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

The actual paths depend on where you installed the project.

The important values are:

```text
WorkingDirectory
ExecStart
```

Both must point to the correct project and virtual-environment locations.

---

# 🔧 systemd Commands

## Start

```bash
systemctl start zarb-table-game
```

## Stop

```bash
systemctl stop zarb-table-game
```

## Restart

```bash
systemctl restart zarb-table-game
```

## Status

```bash
systemctl status zarb-table-game --no-pager
```

A healthy service should show:

```text
Active: active (running)
```

## Enable at VPS Boot

```bash
systemctl enable zarb-table-game
```

This makes the application start automatically after a VPS reboot.

## Disable Automatic Startup

```bash
systemctl disable zarb-table-game
```

---

# 📜 View Application Logs

Follow live logs:

```bash
journalctl -u zarb-table-game -f
```

Show the latest 100 log entries:

```bash
journalctl -u zarb-table-game --no-pager -n 100
```

Show logs from the current boot:

```bash
journalctl -u zarb-table-game -b --no-pager
```

---

# 🔄 Updating an Existing VPS Installation

When updating an existing installation from GitHub, use the following order.

Enter the project directory:

```bash
cd ~/zarb-table-game
```

Create backups:

```bash
cp game.db "game.db.before-update.$(date +%Y%m%d-%H%M%S)"
cp static/rewards.json "static/rewards.json.before-update.$(date +%Y%m%d-%H%M%S)"
```

Stop the service:

```bash
systemctl stop zarb-table-game
```

Pull the latest version:

```bash
git pull
```

Activate the virtual environment:

```bash
source venv/bin/activate
```

Update dependencies:

```bash
python -m pip install -r requirements.txt
```

Check Python syntax:

```bash
python -m py_compile main.py
```

Check the import:

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

If both checks succeed:

```bash
systemctl start zarb-table-game
```

Check the service:

```bash
systemctl status zarb-table-game --no-pager
```

Finally test the application:

```bash
curl -I http://127.0.0.1:8000/static/index.html
```

A successful response should contain:

```text
HTTP/1.1 200 OK
```

---

# 📌 Updating `main.py` Manually With SCP

If you need to transfer a file directly from another computer to the VPS instead of using Git, use SCP.

The SSH port may not be `22`. Use the actual SSH port configured on your server.

Example:

```bash
scp -P YOUR_SSH_PORT "/path/to/main.py" root@YOUR_SERVER_IP:/root/zarb-table-game/main.py
```

For example, if your SSH port is `9011`:

```bash
scp -P 9011 "/path/to/main.py" root@YOUR_SERVER_IP:/root/zarb-table-game/main.py
```

After copying `main.py` to the VPS:

```bash
cd ~/zarb-table-game
source venv/bin/activate

python -m py_compile main.py
python -c "import main; print('MAIN IMPORT OK')"

systemctl restart zarb-table-game
systemctl status zarb-table-game --no-pager
```

> For a public GitHub project, Git-based updates are generally easier to reproduce and maintain than manually copying individual files.

---

# 🧪 Recommended Installation Verification

After installation, perform these checks in order.

## 1. Check Python

```bash
python3 --version
```

## 2. Enter the project

```bash
cd ~/zarb-table-game
```

## 3. Activate the virtual environment

```bash
source venv/bin/activate
```

The prompt should contain:

```text
(venv)
```

## 4. Install dependencies

```bash
python -m pip install -r requirements.txt
```

## 5. Check Python syntax

```bash
python -m py_compile main.py
```

## 6. Check Python import

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

## 7. Start the application manually

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 8. Test the main UI

Open:

```text
http://YOUR_SERVER_IP:8000/static/index.html
```

## 9. Test the Admin Panel

```text
http://YOUR_SERVER_IP:8000/admin/panel.html
```

## 10. Test the Dashboard

```text
http://YOUR_SERVER_IP:8000/dashboard/index.html
```

## 11. Test Practice

```text
http://YOUR_SERVER_IP:8000/practice/
```

## 12. Test Report UI

```text
http://YOUR_SERVER_IP:8000/report-ui/
```

After manual testing, stop Uvicorn with:

```text
CTRL+C
```

Then install the systemd service if this is a production VPS.

---

# 🔥 Test the Server With `curl`

You can test the application directly from the VPS without opening a browser.

Test the main game:

```bash
curl -I http://127.0.0.1:8000/static/index.html
```

A successful response should contain:

```text
HTTP/1.1 200 OK
```

You can also test the other interfaces:

```bash
curl -I http://127.0.0.1:8000/admin/panel.html
curl -I http://127.0.0.1:8000/dashboard/index.html
curl -I http://127.0.0.1:8000/practice/
curl -I http://127.0.0.1:8000/report-ui/
```

---

# 🔌 Port Configuration

The default application port is:

```text
8000
```

Manual execution:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

You can use another port if necessary.

For example:

```bash
uvicorn main:app --host 0.0.0.0 --port 8006
```

If the application is managed by systemd, the systemd service must use the same port.

For example:

```ini
ExecStart=/root/zarb-table-game/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8006
```

After modifying the service file:

```bash
systemctl daemon-reload
systemctl restart zarb-table-game
```

Verify:

```bash
systemctl status zarb-table-game --no-pager
```

> Do not run two Uvicorn instances on the same port.

---

# 🌐 Firewall

If the application works locally on the VPS but cannot be reached from the Internet, check:

1. Linux firewall
2. VPS provider firewall/security group
3. Correct public IP
4. Correct application port
5. Uvicorn listening address

Check the listening port:

```bash
ss -lntp | grep :8000
```

You should see something similar to:

```text
0.0.0.0:8000
```

If UFW is being used:

```bash
ufw status
```

To allow TCP port 8000:

```bash
ufw allow 8000/tcp
```

Then:

```bash
ufw status
```

> Only open ports that are actually required by your deployment.

---

# 📡 API Reference

The following endpoints are provided by the application.

> Request and response examples below are illustrative. The actual response depends on the current application state and implementation.

---

## 1. Game APIs

### Start Game

```text
POST /start
```

Example request:

```json
{
    "players": ["alice", "bob"],
    "families": [2, 3, 4],
    "questions": 10,
    "time": 20
}
```

---

### Get Current Question

```text
GET /question
```

Example response:

```json
{
    "end": false,
    "question": "2x3",
    "player": "alice",
    "number": 1,
    "total": 10,
    "scores": {
        "alice": 0,
        "bob": 0
    },
    "time": 20
}
```

---

### Submit Answer

```text
POST /answer
```

Example:

```json
{
    "player": "alice",
    "question": "2x3",
    "answer": 6
}
```

---

### Finish Game

```text
POST /finish
```

Example:

```json
{
    "players": ["alice", "bob"],
    "scores": {
        "alice": 5,
        "bob": 4
    }
}
```

---

# 2. Practice Mode APIs

## Start Practice

```text
POST /practice/start
```

Example:

```json
{
    "player": "john",
    "families": [2, 3, 4],
    "questions": 10,
    "time": 20
}
```

---

## Submit Practice Answer

```text
POST /practice/answer
```

Example:

```json
{
    "player": "john",
    "question": "2x3",
    "answer": 6
}
```

---

# 3. Player and Report APIs

## List Players

```text
GET /api/players
```

---

## Wrong Answers for a Player

```text
GET /api/wrong/{player}
```

Example:

```text
GET /api/wrong/alice
```

---

## Player Statistics

```text
GET /api/stats/{player}
```

Example:

```text
GET /api/stats/alice
```

---

## Questions With Highest Wrong Count

```text
GET /api/questions-wrong
```

---

## Wrong Statistics by Question

```text
GET /api/wrong-stats/{player}
```

---

## Correct Statistics by Question

```text
GET /api/right-stats/{player}
```

---

# 4. Practice Report APIs

## Practice Players

```text
GET /api/practice-players
```

---

## Practice Statistics

```text
GET /api/practice/stats/{player}
```

---

## Practice Wrong Answers

```text
GET /api/practice/wrong/{player}
```

---

## Practice Questions With Highest Wrong Count

```text
GET /api/practice/questions-wrong
```

---

## Practice Wrong Statistics

```text
GET /api/practice/wrong-stats/{player}
```

---

## Practice Correct Statistics

```text
GET /api/practice/right-stats/{player}
```

---

# 5. Admin APIs

## Admin Login

```text
POST /admin/login
```

Form fields:

```text
username
password
```

---

## Add Player

```text
POST /admin/add-player
```

Form field:

```text
name
```

---

## Add Admin

```text
POST /admin/add-admin
```

Form fields:

```text
username
password
is_superadmin
current_admin_id
```

`is_superadmin`:

```text
0 = normal admin
1 = superadmin
```

Creating another administrator requires the appropriate permissions.

---

# 🧪 API Examples With `curl`

## Start a Game

```bash
curl -X POST "http://127.0.0.1:8000/start" \
-H "Content-Type: application/json" \
-d '{"players":["alice","bob"],"families":[2,3,4],"questions":10,"time":20}'
```

---

## Get Current Question

```bash
curl "http://127.0.0.1:8000/question"
```

---

## Submit an Answer

```bash
curl -X POST "http://127.0.0.1:8000/answer" \
-H "Content-Type: application/json" \
-d '{"player":"alice","question":"2x3","answer":6}'
```

---

## Finish a Game

```bash
curl -X POST "http://127.0.0.1:8000/finish" \
-H "Content-Type: application/json" \
-d '{"players":["alice","bob"],"scores":{"alice":5,"bob":4}}'
```

---

## Start Practice

```bash
curl -X POST "http://127.0.0.1:8000/practice/start" \
-H "Content-Type: application/json" \
-d '{"player":"john","families":[2,3,4],"questions":10,"time":20}'
```

---

# 🗂️ Database Safety Rules

Always create a database backup before:

- deleting records
- resetting reports
- replacing the database
- manually editing database data
- performing a major application update

Example:

```bash
cp game.db "game.db.before-change.$(date +%Y%m%d-%H%M%S)"
```

If you only want to clear historical game/report data, delete records from:

```text
answers
practice_answers
results
```

Do **not** delete:

```text
players
admins
```

unless you intentionally want to remove those accounts.

---

# 🛠️ Common Problems

## Problem 1 — `Directory 'Dashboard' does not exist`

Error:

```text
RuntimeError: Directory 'Dashboard' does not exist
```

Check:

```bash
ls -ld Dashboard
```

If the directory is named:

```text
dashboard/
```

rename it:

```bash
mv dashboard Dashboard
```

Then:

```bash
ls -ld Dashboard
```

---

## Problem 2 — `ModuleNotFoundError`

Example:

```text
ModuleNotFoundError: No module named 'fastapi'
```

Activate the virtual environment:

```bash
source venv/bin/activate
```

Then install dependencies:

```bash
python -m pip install -r requirements.txt
```

---

## Problem 3 — `uvicorn: command not found`

Activate the virtual environment:

```bash
source venv/bin/activate
```

Then:

```bash
python -m pip install -r requirements.txt
```

You can also run Uvicorn directly:

```bash
venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Problem 4 — Port 8000 Is Already in Use

Check:

```bash
ss -lntp | grep :8000
```

If systemd is already running the application, do not start another manual Uvicorn process on the same port.

Check:

```bash
systemctl status zarb-table-game --no-pager
```

---

## Problem 5 — Browser Cannot Connect to the VPS

First test locally on the VPS:

```bash
curl -I http://127.0.0.1:8000/static/index.html
```

If you receive:

```text
HTTP/1.1 200 OK
```

the application is running locally.

If the browser still cannot connect, check:

1. VPS firewall
2. VPS provider firewall/security group
3. Correct public IP
4. Correct port
5. Uvicorn listening address

Check:

```bash
ss -lntp | grep :8000
```

You should see:

```text
0.0.0.0:8000
```

---

## Problem 6 — `/` Returns 404

If:

```text
http://127.0.0.1:8000/
```

returns:

```json
{"detail":"Not Found"}
```

use:

```text
/static/index.html
```

instead.

---

## Problem 7 — `main.py` Has a Syntax Error

Run:

```bash
python -m py_compile main.py
```

Read the reported line number and error message.

Do not restart the production service until the syntax error has been fixed.

---

## Problem 8 — Service Starts and Immediately Stops

Check:

```bash
systemctl status zarb-table-game --no-pager
```

Then:

```bash
journalctl -u zarb-table-game --no-pager -n 100
```

Common causes include:

- wrong Python path
- missing dependency
- incorrect working directory
- missing project directory
- incorrect `Dashboard` casing
- port already in use
- Python import error

---

# 🔄 Recommended VPS Update Procedure

For a production VPS, use this sequence:

```bash
cd ~/zarb-table-game
```

Create backups:

```bash
cp game.db "game.db.before-update.$(date +%Y%m%d-%H%M%S)"
cp static/rewards.json "static/rewards.json.before-update.$(date +%Y%m%d-%H%M%S)"
```

Stop the service:

```bash
systemctl stop zarb-table-game
```

Update the repository:

```bash
git pull
```

Activate the virtual environment:

```bash
source venv/bin/activate
```

Update dependencies:

```bash
python -m pip install -r requirements.txt
```

Validate Python:

```bash
python -m py_compile main.py
```

Validate import:

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

Start the service:

```bash
systemctl start zarb-table-game
```

Check status:

```bash
systemctl status zarb-table-game --no-pager
```

Test:

```bash
curl -I http://127.0.0.1:8000/static/index.html
```

The expected result is:

```text
HTTP/1.1 200 OK
```

---

# 🚦 Recommended First-Time VPS Setup

For a completely new Linux VPS, the shortest safe installation procedure is:

```bash
apt update
apt upgrade -y
apt install -y git python3 python3-pip python3-venv

cd ~
git clone https://github.com/MAPSIM-co/zarb-table-game.git
cd zarb-table-game

python3 -m venv venv
source venv/bin/activate

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

python -m py_compile main.py
python -c "import main; print('MAIN IMPORT OK')"

uvicorn main:app --host 0.0.0.0 --port 8000
```

Then open:

```text
http://YOUR_SERVER_IP:8000/static/index.html
```

After confirming that the application works, stop the manual server:

```text
CTRL+C
```

Then install the systemd service:

```bash
chmod +x setup_service.sh
./setup_service.sh
```

Check:

```bash
systemctl status zarb-table-game --no-pager
```

Because `setup_service.sh` already enables and restarts the service, no additional `systemctl start` or `systemctl enable` is normally required immediately afterward.

---

# 🔒 Production Recommendations

For an Internet-facing deployment:

- Do not use `--reload` in production.
- Do not publish administrator passwords.
- Back up `game.db`.
- Back up custom `static/rewards.json` changes.
- Use a firewall.
- Expose only required ports.
- Prefer HTTPS for public deployments.
- Consider using a reverse proxy such as Nginx or another supported proxy.
- Keep Python dependencies updated.
- Test important updates before replacing a working production deployment.
- Keep a database backup before application updates.
- Do not delete the `players` table when only historical game/report data needs to be reset.
- Do not commit `game.db`, virtual environments, secrets, or Python cache files to GitHub.

A recommended `.gitignore` includes:

```gitignore
venv/
__pycache__/
*.pyc
game.db
*.db
.env
```

---

# 📌 Important Files

| File / Directory | Purpose |
|---|---|
| `main.py` | FastAPI application |
| `game.db` | SQLite database |
| `add_admin.py` | Administrator account setup |
| `setup_service.sh` | Linux systemd service setup |
| `requirements.txt` | Python dependencies |
| `static/` | Main static files |
| `static/rewards.json` | Reward configuration |
| `admin/` | Admin interface |
| `Dashboard/` | Dashboard interface |
| `practice/` | Practice interface |
| `report-ui/` | Report interface |

---

# 🤝 Contributing

Contributions are welcome.

You can:

- Open an issue
- Submit a pull request
- Improve documentation
- Improve the UI
- Add educational features
- Improve testing

When making changes, please preserve existing API compatibility and project structure unless the change intentionally requires otherwise.

---

# 📜 License

This project is licensed under the MIT License.

See:

```text
LICENSE.txt
```

for the complete license text.

---

# 📞 Quick Reference

## Project Directory

```bash
cd ~/zarb-table-game
```

## Activate Environment

```bash
source venv/bin/activate
```

## Validate Python

```bash
python -m py_compile main.py
```

## Validate Import

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

## Start Manually

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Start systemd

```bash
systemctl start zarb-table-game
```

## Stop systemd

```bash
systemctl stop zarb-table-game
```

## Restart systemd

```bash
systemctl restart zarb-table-game
```

## Check systemd

```bash
systemctl status zarb-table-game --no-pager
```

## View Logs

```bash
journalctl -u zarb-table-game -f
```

## Backup Database

```bash
cp game.db "game.db.backup.$(date +%Y%m%d-%H%M%S)"
```

## Main Application

```text
http://SERVER_IP:8000/static/index.html
```

## Admin

```text
http://SERVER_IP:8000/admin/panel.html
```

## Dashboard

```text
http://SERVER_IP:8000/dashboard/index.html
```

## Practice

```text
http://SERVER_IP:8000/practice/
```

## Reports

```text
http://SERVER_IP:8000/report-ui/
```

---

# ✅ Installation Checklist

Use this checklist after installing the project:

- [ ] Git installed
- [ ] Python 3.10+ installed
- [ ] Repository cloned
- [ ] Correct project directory entered
- [ ] `main.py` exists
- [ ] `requirements.txt` exists
- [ ] `setup_service.sh` exists
- [ ] `static/` exists
- [ ] `admin/` exists
- [ ] `Dashboard/` exists with uppercase `D`
- [ ] `practice/` exists
- [ ] `report-ui/` exists
- [ ] `static/rewards.json` exists
- [ ] Virtual environment created
- [ ] Virtual environment activated
- [ ] Python dependencies installed
- [ ] `python -m py_compile main.py` succeeds
- [ ] `python -c "import main; print('MAIN IMPORT OK')"` succeeds
- [ ] Application starts manually
- [ ] `/static/index.html` opens
- [ ] Admin panel opens
- [ ] Dashboard opens
- [ ] Practice opens
- [ ] Report UI opens
- [ ] Administrator account created
- [ ] `game.db` backup created
- [ ] systemd service installed if using a Linux VPS
- [ ] systemd service shows `active (running)`
- [ ] systemd service enabled at boot
- [ ] Firewall configured if required
- [ ] Database backup procedure tested

---

# 🎯 Troubleshooting Order

If something does not work, check the following in order:

```text
1. Is Python installed?
        ↓
2. Is the project directory correct?
        ↓
3. Is the virtual environment activated?
        ↓
4. Are the required dependencies installed?
        ↓
5. Does main.py pass py_compile?
        ↓
6. Does import main work?
        ↓
7. Does Uvicorn start manually?
        ↓
8. Does /static/index.html return 200?
        ↓
9. Can the browser reach the server?
        ↓
10. Does systemd start correctly?
        ↓
11. Check journalctl if systemd fails.
```

This order helps distinguish:

```text
Installation problems
        ↓
Python/dependency problems
        ↓
Application problems
        ↓
Network/firewall problems
        ↓
systemd/service problems
```

---

# 🎯 Final Notes

Zarb Table Game is designed to provide a simple environment for multiplication-table practice, training, and competition.

For a production Linux VPS:

```text
GitHub
   ↓
Project files
   ↓
Python virtual environment
   ↓
FastAPI
   ↓
Uvicorn
   ↓
systemd
   ↓
SQLite (game.db)
```

The recommended production workflow is:

```text
Install
   ↓
Validate
   ↓
Test manually
   ↓
Create database backup
   ↓
Install systemd
   ↓
Verify service
   ↓
Verify browser access
   ↓
Use the application
```

**Zarb Table Game**  
Educational multiplication practice, training, and competition.