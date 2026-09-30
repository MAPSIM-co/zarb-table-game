# بازی جدول ضرب Zarb Table Game

یک بازی آموزشی جدول ضرب برای **تمرین، آموزش و مسابقه**.

Zarb Table Game یک برنامه وب سبک است که با فناوری‌های زیر ساخته شده است:

- Python
- FastAPI
- Uvicorn
- SQLite
- HTML
- CSS
- JavaScript

این برنامه می‌تواند به‌صورت محلی روی **Linux، macOS و Windows** اجرا شود یا روی یک **Linux VPS** با استفاده از `systemd` مستقر شود.

---

# 🌐 زبان

- 🇬🇧 [English](./README.md)

---

# 🚀 نسخه نمایشی

نسخه نمایشی آنلاین:

**[جدول ضرب](http://zarb.mapsim.shop:8000/dashboard/index.html)**

**[پنل مدیریت  جدول ضرب](http://zarb.mapsim.shop:8000/admin/index.html)**

- Username : `admin`
- PassWord : `admin`

**[پنل گزارشات](http://zarb.mapsim.shop:8000/report-ui/index.html)**



> آدرس های بالا فقط یک نمونه از استقرار برنامه است.
>
> برای اجرای Zarb Table Game نیازی به این دامنه نیست و برنامه می‌تواند روی هر سرور، VPS یا کامپیوتر محلی اجرا شود.

---

# 💡 امکانات

- تمرین جدول ضرب از ۱ تا ۹
- آزمون‌های زمان‌دار
- مسابقه چندنفره / کلاسی
- امتیازدهی بازیکنان
- پیگیری پیشرفت بازیکنان
- ثبت نتایج بازی
- حالت تمرین
- بررسی پاسخ‌های اشتباه
- آمار حالت تمرین
- آمار سؤالات
- پنل مدیریت
- مدیریت بازیکنان
- مدیریت مدیران
- پایگاه داده SQLite
- REST API
- پشتیبانی از سرویس `systemd` در Linux
- امکان توسعه روی:
  - Linux
  - macOS
  - Windows

---

# 🛠️ فناوری‌های استفاده‌شده

- Python 3.10+
- FastAPI
- Uvicorn
- SQLite
- HTML
- CSS
- JavaScript

برنامه به یک سرور جداگانه برای پایگاه داده نیاز ندارد.

پایگاه داده برنامه از نوع SQLite است.

فایل پایگاه داده:

```text
game.db
```

---

# 📁 ساختار پروژه

ساختار اصلی پروژه به شکل زیر است:

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

> فایل `game.db` معمولاً توسط برنامه ایجاد می‌شود و نباید در GitHub قرار داده شود.

---

## ⚠️ مهم: نام پوشه `Dashboard`

نام پوشه فیزیکی داشبورد باید دقیقاً به شکل زیر باشد:

```text
Dashboard/
```

حرف `D` باید **بزرگ** باشد.

نام پوشه نباید این باشد:

```text
dashboard/
```

این موضوع به‌خصوص روی Linux مهم است، زیرا سیستم‌فایل Linux به حروف بزرگ و کوچک حساس است.

### تفاوت نام پوشه فیزیکی و مسیر URL

در این پروژه عمداً نام پوشه فیزیکی و مسیر URL از نظر حروف بزرگ و کوچک متفاوت هستند:

| مورد | نام |
|---|---|
| پوشه فیزیکی | `Dashboard/` |
| مسیر URL | `/dashboard/` |

برنامه عمداً مسیر:

```text
/dashboard/
```

را به پوشه فیزیکی:

```text
Dashboard/
```

متصل می‌کند.

این mapping در فایل `main.py` تعریف شده است:

```python
DASHBOARD_DIR = os.path.join(BASE_DIR, "Dashboard")

app.mount(
    "/dashboard",
    StaticFiles(directory=DASHBOARD_DIR),
    name="dashboard"
)
```

بنابراین ساختار صحیح پروژه به شکل زیر است:

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

داشبورد از طریق آدرس زیر قابل دسترسی است:

```text
http://YOUR_SERVER_IP:8000/dashboard/index.html
```

### ⚠️ پوشه را به حروف کوچک تغییر ندهید

پوشه:

```text
Dashboard/
```

را به:

```text
dashboard/
```

تغییر ندهید؛ مگر اینکه هم‌زمان مسیر مربوطه را در `main.py` نیز تغییر دهید.

تنظیم صحیح پروژه باید به این صورت باشد:

```python
DASHBOARD_DIR = os.path.join(BASE_DIR, "Dashboard")
```

و:

```python
app.mount(
    "/dashboard",
    StaticFiles(directory=DASHBOARD_DIR),
    name="dashboard"
)
```

### اگر نام پوشه در Git اشتباه باشد

اگر repository به‌اشتباه شامل پوشه:

```text
dashboard/
```

باشد، به جای:

```text
Dashboard/
```

نام پوشه را مستقیماً در Git اصلاح کنید.

فقط تغییر نام دستی روی VPS کافی نیست، زیرا با `git pull` ممکن است دوباره وضعیت repository به حالت قبلی برگردد.

برای اصلاح نام پوشه در Git:

```bash
git mv dashboard dashboard_temp
git mv dashboard_temp Dashboard
git add -A
git commit -m "Fix Dashboard directory casing"
git push
```

سپس روی VPS:

```bash
cd ~/zarb-table-game
git pull
```

نام پوشه را بررسی کنید:

```bash
ls -ld Dashboard
```

نام مورد انتظار:

```text
Dashboard
```

### بررسی Dashboard بعد از نصب

پس از اجرای برنامه، روی خود سرور این دستور را اجرا کنید:

```bash
curl -I http://127.0.0.1:8000/dashboard/index.html
```

در صورت صحیح بودن تنظیمات، باید پاسخی مشابه زیر دریافت کنید:

```text
HTTP/1.1 200 OK
```

سپس می‌توانید داشبورد را در مرورگر باز کنید:

```text
http://YOUR_SERVER_IP:8000/dashboard/index.html
```

> **نکته مهم:** `Dashboard/` نام پوشه فیزیکی پروژه است، در حالی که `/dashboard/` مسیر URL است. تفاوت حروف بزرگ و کوچک بین این دو عمدی است و باید حفظ شود.

---

# 📦 روش‌های نصب

دو روش اصلی برای اجرای برنامه وجود دارد:

1. **اجرای محلی / Development**
2. **اجرای روی Linux VPS به‌صورت Production با systemd**

اگر برای اولین بار است که برنامه را نصب می‌کنید، مراحل را به ترتیب انجام دهید.

---

# 🐧 نصب روی Linux VPS

این دستورالعمل برای سرورهای مبتنی بر Ubuntu/Debian مناسب است.

---

# مرحله ۱ — به‌روزرسانی سیستم‌عامل

اگر با یک کاربر معمولی که دسترسی `sudo` دارد وارد شده‌اید:

```bash
sudo apt update
sudo apt upgrade -y
```

اگر مستقیماً با کاربر `root` وارد شده‌اید:

```bash
apt update
apt upgrade -y
```

---

# مرحله ۲ — نصب Git

ابتدا بررسی کنید Git نصب است:

```bash
git --version
```

اگر Git نصب نیست:

```bash
sudo apt install -y git
```

اگر با `root` هستید:

```bash
apt install -y git
```

---

# مرحله ۳ — نصب Python

نسخه Python را بررسی کنید:

```bash
python3 --version
```

نسخه پیشنهادی:

```text
Python 3.10+
```

اگر Python یا ابزارهای لازم نصب نیستند:

```bash
sudo apt install -y python3 python3-pip python3-venv
```

برای `root`:

```bash
apt install -y python3 python3-pip python3-venv
```

سپس بررسی کنید:

```bash
python3 --version
pip3 --version
```

---

# مرحله ۴ — دریافت پروژه از GitHub

به پوشه‌ای که می‌خواهید پروژه را در آن نصب کنید بروید.

مثلاً:

```bash
cd ~
git clone https://github.com/MAPSIM-co/zarb-table-game.git
cd zarb-table-game
```

مسیر فعلی را بررسی کنید:

```bash
pwd
```

ممکن است نتیجه‌ای مانند زیر ببینید:

```text
/root/zarb-table-game
```

فایل‌های پروژه را بررسی کنید:

```bash
ls -la
```

---

# مرحله ۵ — بررسی ساختار پروژه

دستور زیر را اجرا کنید:

```bash
ls -ld static admin Dashboard practice report-ui
```

پوشه‌های زیر باید وجود داشته باشند:

```text
static/
admin/
Dashboard/
practice/
report-ui/
```

فایل‌های اصلی را نیز بررسی کنید:

```bash
ls -l main.py
ls -l requirements.txt
ls -l setup_service.sh
```

فایل جایزه‌ها را بررسی کنید:

```bash
ls -l static/rewards.json
```

اگر به‌جای `Dashboard/` پوشه‌ای با نام `dashboard/` دارید:

```bash
mv dashboard Dashboard
```

سپس:

```bash
ls -ld Dashboard
```

باید پوشه‌ای با نام زیر مشاهده کنید:

```text
Dashboard
```

---

# مرحله ۶ — ساخت Virtual Environment

اگر `python3-venv` نصب نیست:

```bash
sudo apt install -y python3-venv
```

در پوشه پروژه Virtual Environment را بسازید:

```bash
python3 -m venv venv
```

فعال کنید:

```bash
source venv/bin/activate
```

پس از فعال شدن باید در ابتدای خط فرمان عبارت زیر را ببینید:

```text
(venv)
```

مثلاً:

```text
(venv) root@server:~/zarb-table-game#
```

---

# مرحله ۷ — نصب وابستگی‌های Python

در حالی که `venv` فعال است:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

برای مشاهده پکیج‌های نصب‌شده:

```bash
pip list
```

---

# مرحله ۸ — بررسی Syntax فایل `main.py`

قبل از اجرای برنامه، Syntax پایتون را بررسی کنید:

```bash
python -m py_compile main.py
```

اگر دستور بدون خطا به خط فرمان برگردد، بررسی Syntax موفق بوده است.

در حالت موفق معمولاً هیچ خروجی‌ای نمایش داده نمی‌شود.

---

# مرحله ۹ — بررسی Import برنامه

دستور زیر را اجرا کنید:

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

خروجی مورد انتظار:

```text
MAIN IMPORT OK
```

اگر خطایی مشاهده کردید، قبل از راه‌اندازی `systemd` ابتدا همان خطا را برطرف کنید.

---

# 🗄️ پایگاه داده

برنامه از SQLite استفاده می‌کند.

فایل پایگاه داده:

```text
game.db
```

نیازی به نصب موارد زیر نیست:

- MySQL
- PostgreSQL
- MariaDB
- یا هر Database Server دیگری

SQLite مستقیماً در قالب یک فایل روی سرور ذخیره می‌شود.

در صورت نبودن `game.db`، برنامه هنگام راه‌اندازی پایگاه داده و جداول مورد نیاز را ایجاد می‌کند.

---

# 📊 جداول پایگاه داده

جداول اصلی برنامه عبارت‌اند از:

| جدول | کاربرد |
|---|---|
| `players` | بازیکنان ثبت‌شده |
| `admins` | حساب مدیران |
| `results` | نتایج و امتیازات بازی‌های تمام‌شده |
| `answers` | پاسخ‌های ثبت‌شده در بازی عادی |
| `practice_answers` | پاسخ‌های ثبت‌شده در حالت تمرین |

---

# 🔐 تهیه Backup از Database

قبل از حذف، Reset، جایگزینی یا تغییر دستی اطلاعات دیتابیس، حتماً Backup بگیرید.

از داخل پوشه پروژه:

```bash
cp game.db game.db.backup
```

روش بهتر، استفاده از تاریخ و ساعت در نام فایل است:

```bash
cp game.db "game.db.$(date +%Y%m%d-%H%M%S).backup"
```

مثلاً:

```text
game.db.20260930-170000.backup
```

برای اطلاعات مهم بهتر است Backup را علاوه بر سرور، در یک محل جداگانه نیز نگهداری کنید.

---

# 🔎 مشاهده ساختار Database

برای استفاده از SQLite نیازی نیست برنامه جداگانه `sqlite3` نصب کنید.

Python خودش از SQLite پشتیبانی می‌کند.

ابتدا Virtual Environment را فعال کنید:

```bash
source venv/bin/activate
```

سپس:

```bash
python
```

داخل Python:

```python
import sqlite3

conn = sqlite3.connect("game.db")
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print(cursor.fetchall())

conn.close()
```

برای خروج:

```python
exit()
```

---

# 📊 مشاهده تعداد رکوردهای جداول

برای مشاهده تعداد رکوردهای جداول اصلی:

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

مثلاً:

```text
admins: 1
players: 4
answers: 25
practice_answers: 10
results: 5
```

---

# ⚠️ حذف اطلاعات قدیمی بازی و گزارش‌ها

اگر می‌خواهید اطلاعات قدیمی بازی‌ها و گزارش‌ها را پاک کنید ولی **بازیکنان ثبت‌شده باقی بمانند**، به هیچ عنوان جدول `players` را حذف نکنید.

ابتدا Backup بگیرید:

```bash
cp game.db "game.db.before-reset.$(date +%Y%m%d-%H%M%S)"
```

سپس فقط اطلاعات بازی و گزارش را پاک کنید:

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

این عملیات فقط اطلاعات جداول زیر را پاک می‌کند:

```text
answers
practice_answers
results
```

و اطلاعات زیر را نگه می‌دارد:

```text
players
admins
```

برای بررسی نتیجه:

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

بعد از Reset باید چیزی شبیه این ببینید:

```text
admins: <تعداد مدیران موجود>
players: <تعداد بازیکنان موجود>
answers: 0
practice_answers: 0
results: 0
```

> **اگر فقط قصد پاک کردن گزارش‌ها و بازی‌های قدیمی را دارید، هرگز `DELETE FROM players` اجرا نکنید.**

---

# 🎁 تنظیم جوایز

جوایز برنامه در فایل زیر قرار دارند:

```text
static/rewards.json
```

یک نمونه:

```json
[
    {
        "name": "شکلات 🍫",
        "desc": "تبریک! یک شکلات خوشمزه جایزه گرفتی!"
    },
    {
        "name": "خوراکی دلخواه 🍿",
        "desc": "یک خوراکی دلخواه در محدوده مجاز انتخاب کن."
    },
    {
        "name": "نوشیدنی 🥤",
        "desc": "تبریک! یک نوشیدنی دلخواه جایزه گرفتی."
    }
]
```

می‌توانید این فایل را با هر ویرایشگر متنی تغییر دهید.

بعد از تغییر، معتبر بودن JSON را بررسی کنید:

```bash
python -m json.tool static/rewards.json
```

اگر JSON معتبر باشد، Python نسخه مرتب‌شده آن را نمایش می‌دهد.

اگر خطای Syntax مشاهده کردید، ابتدا فایل را اصلاح کنید.

---

# ▶️ اجرای دستی برنامه

اجرای دستی برای تست و توسعه مناسب است.

Virtual Environment را فعال کنید:

```bash
source venv/bin/activate
```

سپس:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

برنامه روی پورت زیر اجرا می‌شود:

```text
8000
```

گزینه `--reload` برای توسعه و تست است.

> در محیط Production معمولاً نباید از `--reload` استفاده کنید.

برای توقف برنامه:

```text
CTRL+C
```

---

# 🌐 آدرس‌های برنامه

در آدرس‌های زیر، عبارت:

```text
YOUR_SERVER_IP
```

را با IP عمومی یا دامنه سرور خود جایگزین کنید.

## 🎮 بازی اصلی

```text
http://YOUR_SERVER_IP:8000/static/index.html
```

## 👑 پنل مدیریت

```text
http://YOUR_SERVER_IP:8000/admin/panel.html
```

## 📊 داشبورد

```text
http://YOUR_SERVER_IP:8000/dashboard/index.html
```

## 🧠 تمرین

```text
http://YOUR_SERVER_IP:8000/practice/
```

## 📈 گزارش‌ها

```text
http://YOUR_SERVER_IP:8000/report-ui/
```

---

# ℹ️ چرا ممکن است `/` خطای 404 بدهد؟

ممکن است برنامه برای مسیر اصلی `/` Route تعریف نکرده باشد.

بنابراین این آدرس:

```text
http://127.0.0.1:8000/
```

ممکن است نتیجه زیر را بدهد:

```json
{"detail":"Not Found"}
```

این موضوع لزوماً به معنی خراب بودن برنامه نیست.

صفحه اصلی بازی:

```text
/static/index.html
```

است.

بنابراین برای تست محلی:

```text
http://127.0.0.1:8000/static/index.html
```

را باز کنید.

---

# 🖥️ نصب روی macOS

Python 3 و Git را نصب کنید.

Repository را دریافت کنید:

```bash
git clone https://github.com/MAPSIM-co/zarb-table-game.git
cd zarb-table-game
```

Virtual Environment را بسازید:

```bash
python3 -m venv venv
```

فعال کنید:

```bash
source venv/bin/activate
```

وابستگی‌ها را نصب کنید:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Syntax را بررسی کنید:

```bash
python -m py_compile main.py
```

برنامه را اجرا کنید:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000
```

در مرورگر باز کنید:

```text
http://127.0.0.1:8000/static/index.html
```

برای توقف:

```text
CTRL+C
```

---

# 🪟 نصب روی Windows

PowerShell را باز کنید.

Repository را دریافت کنید:

```powershell
git clone https://github.com/MAPSIM-co/zarb-table-game.git
cd zarb-table-game
```

Virtual Environment را بسازید:

```powershell
python -m venv venv
```

فعال کنید:

```powershell
.\venv\Scripts\activate
```

وابستگی‌ها را نصب کنید:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Syntax را بررسی کنید:

```powershell
python -m py_compile main.py
```

برنامه را اجرا کنید:

```powershell
uvicorn main:app --host 127.0.0.1 --port 8000
```

در مرورگر باز کنید:

```text
http://127.0.0.1:8000/static/index.html
```

برای توقف:

```text
CTRL+C
```

---

# 👑 ایجاد مدیر

فایل زیر برای ایجاد/مدیریت حساب مدیر در پروژه وجود دارد:

```text
add_admin.py
```

در حالی که Virtual Environment فعال است:

```bash
python add_admin.py
```

دستورالعمل‌های نمایش داده‌شده توسط اسکریپت را دنبال کنید.

> نام کاربری و رمز عبور پیش‌فرض را فرض نکنید؛ مگر اینکه نسخه موجود `add_admin.py` صراحتاً چنین حسابی ایجاد کند.

> **هیچ رمز عبور واقعی مدیر را داخل GitHub منتشر نکنید.**

---

# 👨‍👩‍👧 مدیریت بازیکنان

بازیکنان در جدول زیر ذخیره می‌شوند:

```text
players
```

این جدول داخل فایل:

```text
game.db
```

قرار دارد.

مدیریت بازیکنان از طریق پنل مدیریت انجام می‌شود.

پنل مدیریت:

```text
/admin/panel.html
```

API مربوط به اضافه کردن بازیکن:

```text
POST /admin/add-player
```

---

# 👤 مدیریت مدیران

حساب‌های مدیران در جدول:

```text
admins
```

داخل:

```text
game.db
```

ذخیره می‌شوند.

ورود مدیر:

```text
POST /admin/login
```

ایجاد مدیر جدید:

```text
POST /admin/add-admin
```

ایجاد مدیر جدید نیازمند سطح دسترسی مناسب است.

---

# ⚙️ راه‌اندازی Production روی Linux با systemd

برای اجرای دائمی برنامه روی Linux VPS، روش پیشنهادی استفاده از **systemd** است.

فایل مربوط به راه‌اندازی سرویس:

```text
setup_service.sh
```

وجود دارد.

## ⚠️ نکته بسیار مهم

اسکریپت `setup_service.sh` مسیر پروژه را بر اساس **پوشه فعلی که اسکریپت را از آن اجرا می‌کنید** تعیین می‌کند.

بنابراین قبل از اجرای آن حتماً وارد پوشه پروژه شوید:

```bash
cd ~/zarb-table-game
```

سپس:

```bash
chmod +x setup_service.sh
```

اگر کاربر عادی هستید:

```bash
sudo ./setup_service.sh
```

اگر با `root` وارد شده‌اید:

```bash
./setup_service.sh
```

این اسکریپت سرویس زیر را ایجاد می‌کند:

```text
zarb-table-game.service
```

اسکریپت به‌صورت خودکار:

1. بررسی می‌کند با دسترسی root اجرا شده باشد.
2. وجود Uvicorn داخل Virtual Environment را بررسی می‌کند.
3. فایل systemd را ایجاد می‌کند.
4. systemd را Reload می‌کند.
5. سرویس را برای اجرای خودکار در زمان Boot فعال می‌کند.
6. سرویس را Restart می‌کند.

بنابراین بعد از اجرای موفق `setup_service.sh` معمولاً نیازی به اجرای دستی `systemctl start` و `systemctl enable` ندارید.

---

# 🔄 تنظیمات systemd

سرویس Production بدون `--reload` اجرا می‌شود.

نمونه تنظیمات:

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

اگر پروژه در مسیر دیگری نصب شده باشد، باید این مسیرها متناسب با نصب شما تغییر کنند:

```text
WorkingDirectory
ExecStart
```

---

# 🔧 دستورات systemd

## شروع سرویس

```bash
systemctl start zarb-table-game
```

## توقف سرویس

```bash
systemctl stop zarb-table-game
```

## Restart

```bash
systemctl restart zarb-table-game
```

## مشاهده وضعیت

```bash
systemctl status zarb-table-game --no-pager
```

اگر سرویس سالم باشد باید چیزی شبیه زیر ببینید:

```text
Active: active (running)
```

## فعال کردن اجرای خودکار بعد از Boot

```bash
systemctl enable zarb-table-game
```

## غیرفعال کردن اجرای خودکار

```bash
systemctl disable zarb-table-game
```

---

# 📜 مشاهده Log برنامه

برای مشاهده زنده Logها:

```bash
journalctl -u zarb-table-game -f
```

آخرین ۱۰۰ خط:

```bash
journalctl -u zarb-table-game --no-pager -n 100
```

Logهای Boot فعلی:

```bash
journalctl -u zarb-table-game -b --no-pager
```

---

# 🔄 به‌روزرسانی نسخه موجود روی VPS

اگر برنامه از قبل روی VPS نصب شده و می‌خواهید نسخه جدید GitHub را دریافت کنید، این ترتیب را انجام دهید.

ابتدا وارد پروژه شوید:

```bash
cd ~/zarb-table-game
```

از دیتابیس Backup بگیرید:

```bash
cp game.db "game.db.before-update.$(date +%Y%m%d-%H%M%S)"
```

از فایل جوایز نیز Backup بگیرید:

```bash
cp static/rewards.json "static/rewards.json.before-update.$(date +%Y%m%d-%H%M%S)"
```

سرویس را متوقف کنید:

```bash
systemctl stop zarb-table-game
```

نسخه جدید را دریافت کنید:

```bash
git pull
```

Virtual Environment را فعال کنید:

```bash
source venv/bin/activate
```

وابستگی‌ها را به‌روزرسانی کنید:

```bash
python -m pip install -r requirements.txt
```

Syntax را بررسی کنید:

```bash
python -m py_compile main.py
```

Import را بررسی کنید:

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

اگر هر دو بررسی موفق بودند:

```bash
systemctl start zarb-table-game
```

وضعیت را بررسی کنید:

```bash
systemctl status zarb-table-game --no-pager
```

در نهایت:

```bash
curl -I http://127.0.0.1:8000/static/index.html
```

باید پاسخ زیر را دریافت کنید:

```text
HTTP/1.1 200 OK
```

---

# 📌 انتقال دستی `main.py` با SCP

اگر لازم است فایلی را مستقیماً از کامپیوتر خود به VPS منتقل کنید، می‌توانید از `scp` استفاده کنید.

> توجه: پورت SSH ممکن است `22` نباشد. باید پورت واقعی SSH سرور خود را استفاده کنید.

فرمت کلی:

```bash
scp -P YOUR_SSH_PORT "/path/to/main.py" root@YOUR_SERVER_IP:/root/zarb-table-game/main.py
```

مثلاً اگر SSH روی پورت `9011` باشد:

```bash
scp -P 9011 "/path/to/main.py" root@YOUR_SERVER_IP:/root/zarb-table-game/main.py
```

بعد از انتقال فایل:

```bash
cd ~/zarb-table-game
source venv/bin/activate

python -m py_compile main.py
python -c "import main; print('MAIN IMPORT OK')"

systemctl restart zarb-table-game
systemctl status zarb-table-game --no-pager
```

> برای مدیریت بهتر نسخه‌ها، استفاده از Git و `git pull` معمولاً بهتر از انتقال دستی فایل‌هاست.

---

# 🧪 بررسی کامل نصب

بعد از نصب، مراحل زیر را به‌ترتیب انجام دهید.

## ۱. بررسی Python

```bash
python3 --version
```

## ۲. ورود به پروژه

```bash
cd ~/zarb-table-game
```

## ۳. فعال کردن Virtual Environment

```bash
source venv/bin/activate
```

باید عبارت زیر را ببینید:

```text
(venv)
```

## ۴. نصب وابستگی‌ها

```bash
python -m pip install -r requirements.txt
```

## ۵. بررسی Syntax

```bash
python -m py_compile main.py
```

## ۶. بررسی Import

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

## ۷. اجرای دستی

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## ۸. تست بازی اصلی

```text
http://YOUR_SERVER_IP:8000/static/index.html
```

## ۹. تست پنل مدیریت

```text
http://YOUR_SERVER_IP:8000/admin/panel.html
```

## ۱۰. تست Dashboard

```text
http://YOUR_SERVER_IP:8000/dashboard/index.html
```

## ۱۱. تست Practice

```text
http://YOUR_SERVER_IP:8000/practice/
```

## ۱۲. تست Report UI

```text
http://YOUR_SERVER_IP:8000/report-ui/
```

بعد از تست دستی:

```text
CTRL+C
```

را بزنید.

---

# 🔥 تست با `curl`

می‌توانید بدون مرورگر نیز برنامه را تست کنید.

روی خود VPS:

```bash
curl -I http://127.0.0.1:8000/static/index.html
```

در صورت سالم بودن باید چیزی شبیه زیر ببینید:

```text
HTTP/1.1 200 OK
```

سایر بخش‌ها:

```bash
curl -I http://127.0.0.1:8000/admin/panel.html
curl -I http://127.0.0.1:8000/dashboard/index.html
curl -I http://127.0.0.1:8000/practice/
curl -I http://127.0.0.1:8000/report-ui/
```

---

# 🔌 تنظیم پورت

پورت پیش‌فرض برنامه:

```text
8000
```

اجرای دستی:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

در صورت نیاز می‌توانید پورت دیگری استفاده کنید.

مثلاً:

```bash
uvicorn main:app --host 0.0.0.0 --port 8006
```

اگر برنامه با systemd اجرا می‌شود، پورت داخل فایل سرویس نیز باید تغییر کند.

مثلاً:

```ini
ExecStart=/root/zarb-table-game/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8006
```

بعد از تغییر فایل systemd:

```bash
systemctl daemon-reload
systemctl restart zarb-table-game
```

وضعیت:

```bash
systemctl status zarb-table-game --no-pager
```

> روی یک پورت نباید دو Uvicorn هم‌زمان اجرا شوند.

---

# 🌐 Firewall

اگر برنامه روی خود VPS کار می‌کند ولی از اینترنت قابل دسترسی نیست، موارد زیر را بررسی کنید:

1. Firewall خود Linux
2. Firewall یا Security Group شرکت VPS
3. IP عمومی صحیح
4. پورت صحیح
5. اینکه Uvicorn روی `0.0.0.0` گوش می‌دهد

بررسی پورت:

```bash
ss -lntp | grep :8000
```

باید چیزی شبیه زیر ببینید:

```text
0.0.0.0:8000
```

اگر از UFW استفاده می‌کنید:

```bash
ufw status
```

برای باز کردن پورت 8000:

```bash
ufw allow 8000/tcp
```

سپس:

```bash
ufw status
```

> فقط پورت‌هایی را باز کنید که واقعاً در استقرار شما مورد نیاز هستند.

---

# 📡 مرجع API

Endpointهای اصلی برنامه در ادامه آمده‌اند.

> نمونه‌های Request و Response صرفاً نمونه هستند و نتیجه واقعی به وضعیت فعلی برنامه و پیاده‌سازی نسخه مورد استفاده بستگی دارد.

---

# ۱. APIهای بازی

## شروع بازی

```text
POST /start
```

نمونه Request:

```json
{
    "players": ["alice", "bob"],
    "families": [2, 3, 4],
    "questions": 10,
    "time": 20
}
```

---

## دریافت سؤال فعلی

```text
GET /question
```

نمونه Response:

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

## ارسال پاسخ

```text
POST /answer
```

نمونه:

```json
{
    "player": "alice",
    "question": "2x3",
    "answer": 6
}
```

---

## پایان بازی

```text
POST /finish
```

نمونه:

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

# ۲. APIهای حالت تمرین

## شروع تمرین

```text
POST /practice/start
```

نمونه:

```json
{
    "player": "john",
    "families": [2, 3, 4],
    "questions": 10,
    "time": 20
}
```

---

## ارسال پاسخ تمرین

```text
POST /practice/answer
```

نمونه:

```json
{
    "player": "john",
    "question": "2x3",
    "answer": 6
}
```

---

# ۳. APIهای بازیکن و گزارش

## دریافت لیست بازیکنان

```text
GET /api/players
```

---

## پاسخ‌های اشتباه یک بازیکن

```text
GET /api/wrong/{player}
```

مثال:

```text
GET /api/wrong/alice
```

---

## آمار بازیکن

```text
GET /api/stats/{player}
```

مثال:

```text
GET /api/stats/alice
```

---

## سؤالات دارای بیشترین پاسخ اشتباه

```text
GET /api/questions-wrong
```

---

## آمار اشتباه به تفکیک سؤال

```text
GET /api/wrong-stats/{player}
```

---

## آمار پاسخ صحیح به تفکیک سؤال

```text
GET /api/right-stats/{player}
```

---

# ۴. APIهای گزارش Practice

## بازیکنان Practice

```text
GET /api/practice-players
```

---

## آمار Practice

```text
GET /api/practice/stats/{player}
```

---

## پاسخ‌های اشتباه Practice

```text
GET /api/practice/wrong/{player}
```

---

## سؤالات Practice با بیشترین خطا

```text
GET /api/practice/questions-wrong
```

---

## آمار خطا در Practice

```text
GET /api/practice/wrong-stats/{player}
```

---

## آمار پاسخ صحیح در Practice

```text
GET /api/practice/right-stats/{player}
```

---

# ۵. APIهای مدیریت

## ورود مدیر

```text
POST /admin/login
```

فیلدهای Form:

```text
username
password
```

---

## اضافه کردن بازیکن

```text
POST /admin/add-player
```

فیلد:

```text
name
```

---

## اضافه کردن مدیر

```text
POST /admin/add-admin
```

فیلدها:

```text
username
password
is_superadmin
current_admin_id
```

مقدار `is_superadmin`:

```text
0 = مدیر عادی
1 = مدیر ارشد
```

ایجاد مدیر جدید نیازمند دسترسی مناسب است.

---

# 🧪 نمونه API با curl

## شروع بازی

```bash
curl -X POST "http://127.0.0.1:8000/start" \
-H "Content-Type: application/json" \
-d '{"players":["alice","bob"],"families":[2,3,4],"questions":10,"time":20}'
```

---

## دریافت سؤال

```bash
curl "http://127.0.0.1:8000/question"
```

---

## ارسال پاسخ

```bash
curl -X POST "http://127.0.0.1:8000/answer" \
-H "Content-Type: application/json" \
-d '{"player":"alice","question":"2x3","answer":6}'
```

---

## پایان بازی

```bash
curl -X POST "http://127.0.0.1:8000/finish" \
-H "Content-Type: application/json" \
-d '{"players":["alice","bob"],"scores":{"alice":5,"bob":4}}'
```

---

## شروع تمرین

```bash
curl -X POST "http://127.0.0.1:8000/practice/start" \
-H "Content-Type: application/json" \
-d '{"player":"john","families":[2,3,4],"questions":10,"time":20}'
```

---

# 🗂️ قوانین ایمنی Database

قبل از موارد زیر همیشه Backup بگیرید:

- حذف رکوردها
- Reset گزارش‌ها
- جایگزینی Database
- ویرایش دستی اطلاعات
- به‌روزرسانی‌های مهم برنامه

مثال:

```bash
cp game.db "game.db.before-change.$(date +%Y%m%d-%H%M%S)"
```

اگر فقط می‌خواهید گزارش‌ها و بازی‌های قدیمی پاک شوند، جداول زیر را هدف قرار دهید:

```text
answers
practice_answers
results
```

و این جداول را دست‌نخورده نگه دارید:

```text
players
admins
```

---

# 🛠️ مشکلات رایج

## مشکل ۱ — خطای `Directory 'Dashboard' does not exist`

خطا:

```text
RuntimeError: Directory 'Dashboard' does not exist
```

بررسی کنید:

```bash
ls -ld Dashboard
```

اگر پوشه به شکل زیر است:

```text
dashboard/
```

آن را تغییر دهید:

```bash
mv dashboard Dashboard
```

سپس:

```bash
ls -ld Dashboard
```

---

# مشکل ۲ — `ModuleNotFoundError`

مثلاً:

```text
ModuleNotFoundError: No module named 'fastapi'
```

Virtual Environment را فعال کنید:

```bash
source venv/bin/activate
```

سپس:

```bash
python -m pip install -r requirements.txt
```

---

# مشکل ۳ — `uvicorn: command not found`

Virtual Environment را فعال کنید:

```bash
source venv/bin/activate
```

سپس:

```bash
python -m pip install -r requirements.txt
```

یا مستقیماً:

```bash
venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
```

---

# مشکل ۴ — پورت 8000 قبلاً استفاده شده است

بررسی کنید:

```bash
ss -lntp | grep :8000
```

اگر systemd در حال اجرای برنامه است، یک Uvicorn دستی دیگر روی همان پورت اجرا نکنید.

وضعیت سرویس:

```bash
systemctl status zarb-table-game --no-pager
```

---

# مشکل ۵ — مرورگر نمی‌تواند به VPS متصل شود

ابتدا روی خود VPS تست کنید:

```bash
curl -I http://127.0.0.1:8000/static/index.html
```

اگر نتیجه:

```text
HTTP/1.1 200 OK
```

بود، برنامه روی خود VPS در حال اجرا است.

اگر مرورگر همچنان نمی‌تواند وصل شود، موارد زیر را بررسی کنید:

1. Firewall VPS
2. Firewall شرکت ارائه‌دهنده VPS
3. IP عمومی صحیح
4. پورت صحیح
5. اجرای Uvicorn روی `0.0.0.0`

بررسی کنید:

```bash
ss -lntp | grep :8000
```

باید چیزی شبیه زیر ببینید:

```text
0.0.0.0:8000
```

---

# مشکل ۶ — مسیر `/` خطای 404 می‌دهد

اگر:

```text
http://127.0.0.1:8000/
```

نتیجه زیر را داد:

```json
{"detail":"Not Found"}
```

از مسیر زیر استفاده کنید:

```text
/static/index.html
```

---

# مشکل ۷ — خطای Syntax در `main.py`

اجرا کنید:

```bash
python -m py_compile main.py
```

شماره خط و پیام خطا را بررسی کنید.

تا زمانی که خطای Syntax برطرف نشده، سرویس Production را Restart نکنید.

---

# مشکل ۸ — systemd اجرا می‌شود و بلافاصله متوقف می‌شود

ابتدا:

```bash
systemctl status zarb-table-game --no-pager
```

سپس:

```bash
journalctl -u zarb-table-game --no-pager -n 100
```

دلایل رایج:

- مسیر اشتباه Python
- نصب نبودن dependency
- مسیر اشتباه پروژه
- نبودن پوشه پروژه
- اشتباه بودن حروف `Dashboard`
- اشغال بودن پورت
- خطای Import در Python

---

# 🔄 روش پیشنهادی به‌روزرسانی VPS

برای یک VPS Production بهتر است این ترتیب را رعایت کنید:

```bash
cd ~/zarb-table-game
```

Backup:

```bash
cp game.db "game.db.before-update.$(date +%Y%m%d-%H%M%S)"
cp static/rewards.json "static/rewards.json.before-update.$(date +%Y%m%d-%H%M%S)"
```

توقف سرویس:

```bash
systemctl stop zarb-table-game
```

دریافت نسخه جدید:

```bash
git pull
```

فعال کردن محیط:

```bash
source venv/bin/activate
```

به‌روزرسانی dependencyها:

```bash
python -m pip install -r requirements.txt
```

بررسی Syntax:

```bash
python -m py_compile main.py
```

بررسی Import:

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

شروع سرویس:

```bash
systemctl start zarb-table-game
```

بررسی:

```bash
systemctl status zarb-table-game --no-pager
```

تست:

```bash
curl -I http://127.0.0.1:8000/static/index.html
```

نتیجه مورد انتظار:

```text
HTTP/1.1 200 OK
```

---

# 🚦 نصب سریع روی VPS جدید

اگر یک Linux VPS کاملاً جدید دارید، مراحل اصلی به شکل زیر است:

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

سپس در مرورگر:

```text
http://YOUR_SERVER_IP:8000/static/index.html
```

پس از اطمینان از سالم بودن برنامه:

```text
CTRL+C
```

سپس سرویس Production را نصب کنید:

```bash
chmod +x setup_service.sh
./setup_service.sh
```

وضعیت را بررسی کنید:

```bash
systemctl status zarb-table-game --no-pager
```

از آنجا که `setup_service.sh` سرویس را Enable و Restart می‌کند، بلافاصله پس از اجرای موفق آن معمولاً نیازی به اجرای مجدد `systemctl start` یا `systemctl enable` نیست.

---

# 🔒 توصیه‌های امنیتی برای Production

اگر برنامه را روی اینترنت قرار می‌دهید:

- در Production از `--reload` استفاده نکنید.
- رمز عبور واقعی مدیران را در GitHub قرار ندهید.
- از `game.db` مرتب Backup بگیرید.
- اگر `rewards.json` را شخصی‌سازی کرده‌اید از آن Backup بگیرید.
- Firewall فعال داشته باشید.
- فقط پورت‌های موردنیاز را باز کنید.
- برای سرویس عمومی استفاده از HTTPS توصیه می‌شود.
- در صورت نیاز از Reverse Proxy استفاده کنید.
- dependencyهای Python را به‌روز نگه دارید.
- قبل از Updateهای مهم، Backup بگیرید.
- قبل از تغییرات مهم Production را تست کنید.
- برای پاک کردن گزارش‌های قدیمی، جدول `players` را حذف نکنید.
- فایل Database، Virtual Environment، Secretها و فایل‌های cache را در GitHub قرار ندهید.

یک `.gitignore` پیشنهادی:

```gitignore
venv/
__pycache__/
*.pyc
game.db
*.db
.env
```

---

# 📌 فایل‌های مهم پروژه

| فایل / پوشه | کاربرد |
|---|---|
| `main.py` | برنامه اصلی FastAPI |
| `game.db` | پایگاه داده SQLite |
| `add_admin.py` | ایجاد/مدیریت حساب مدیر |
| `setup_service.sh` | راه‌اندازی سرویس systemd |
| `requirements.txt` | وابستگی‌های Python |
| `static/` | فایل‌های اصلی رابط کاربری |
| `static/rewards.json` | تنظیمات جوایز |
| `admin/` | رابط مدیریت |
| `Dashboard/` | رابط داشبورد |
| `practice/` | رابط تمرین |
| `report-ui/` | رابط گزارش‌ها |

---

# 🤝 مشارکت در پروژه

مشارکت در پروژه آزاد است.

می‌توانید:

- Issue ایجاد کنید
- Pull Request ارسال کنید
- مستندات را بهبود دهید
- رابط کاربری را بهبود دهید
- امکانات آموزشی جدید اضافه کنید
- تست‌های بیشتری اضافه کنید

لطفاً هنگام تغییر پروژه، سازگاری APIها و ساختار موجود را حفظ کنید؛ مگر اینکه تغییر عمداً به تغییر ساختار یا API نیاز داشته باشد.

---

# 📜 مجوز

این پروژه تحت مجوز MIT منتشر شده است.

متن کامل مجوز در فایل زیر قرار دارد:

```text
LICENSE.txt
```

---

# 📞 دستورات مهم و سریع

## ورود به پوشه پروژه

```bash
cd ~/zarb-table-game
```

## فعال کردن محیط Python

```bash
source venv/bin/activate
```

## بررسی Syntax

```bash
python -m py_compile main.py
```

## بررسی Import

```bash
python -c "import main; print('MAIN IMPORT OK')"
```

## اجرای دستی

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## شروع systemd

```bash
systemctl start zarb-table-game
```

## توقف systemd

```bash
systemctl stop zarb-table-game
```

## Restart systemd

```bash
systemctl restart zarb-table-game
```

## بررسی systemd

```bash
systemctl status zarb-table-game --no-pager
```

## مشاهده Log

```bash
journalctl -u zarb-table-game -f
```

## Backup دیتابیس

```bash
cp game.db "game.db.backup.$(date +%Y%m%d-%H%M%S)"
```

## بازی اصلی

```text
http://SERVER_IP:8000/static/index.html
```

## پنل مدیریت

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

## گزارش‌ها

```text
http://SERVER_IP:8000/report-ui/
```

---

# ✅ چک‌لیست نصب

بعد از نصب پروژه موارد زیر را بررسی کنید:

- [ ] Git نصب شده است
- [ ] Python 3.10+ نصب شده است
- [ ] Repository دریافت شده است
- [ ] وارد پوشه صحیح پروژه شده‌اید
- [ ] `main.py` وجود دارد
- [ ] `requirements.txt` وجود دارد
- [ ] `setup_service.sh` وجود دارد
- [ ] `static/` وجود دارد
- [ ] `admin/` وجود دارد
- [ ] `Dashboard/` با `D` بزرگ وجود دارد
- [ ] `practice/` وجود دارد
- [ ] `report-ui/` وجود دارد
- [ ] `static/rewards.json` وجود دارد
- [ ] Virtual Environment ساخته شده است
- [ ] Virtual Environment فعال شده است
- [ ] dependencyها نصب شده‌اند
- [ ] `python -m py_compile main.py` موفق است
- [ ] `python -c "import main; print('MAIN IMPORT OK')"` موفق است
- [ ] برنامه به‌صورت دستی اجرا می‌شود
- [ ] `/static/index.html` باز می‌شود
- [ ] پنل مدیریت باز می‌شود
- [ ] Dashboard باز می‌شود
- [ ] Practice باز می‌شود
- [ ] Report UI باز می‌شود
- [ ] حساب مدیر ایجاد شده است
- [ ] از `game.db` Backup گرفته شده است
- [ ] systemd در صورت نیاز نصب شده است
- [ ] وضعیت systemd برابر `active (running)` است
- [ ] systemd برای اجرای خودکار هنگام Boot فعال است
- [ ] Firewall در صورت نیاز تنظیم شده است
- [ ] روش Backup دیتابیس آزمایش شده است

---

# 🎯 ترتیب پیشنهادی برای عیب‌یابی

اگر برنامه کار نمی‌کند، موارد زیر را دقیقاً به همین ترتیب بررسی کنید:

```text
1. آیا Python نصب است؟
        ↓
2. آیا وارد پوشه صحیح پروژه شده‌اید؟
        ↓
3. آیا Virtual Environment فعال است؟
        ↓
4. آیا dependencyها نصب شده‌اند؟
        ↓
5. آیا main.py از py_compile عبور می‌کند؟
        ↓
6. آیا import main موفق است؟
        ↓
7. آیا Uvicorn به‌صورت دستی اجرا می‌شود؟
        ↓
8. آیا /static/index.html پاسخ 200 می‌دهد؟
        ↓
9. آیا مرورگر می‌تواند به VPS متصل شود؟
        ↓
10. آیا systemd به‌درستی اجرا می‌شود؟
        ↓
11. در صورت مشکل systemd، journalctl را بررسی کنید.
```

این ترتیب کمک می‌کند مشخص شود مشکل مربوط به کدام بخش است:

```text
نصب
 ↓
Python / Dependency
 ↓
برنامه
 ↓
شبکه / Firewall
 ↓
systemd
```

---

# 🎯 جمع‌بندی

Zarb Table Game یک برنامه آموزشی برای **تمرین، آموزش و مسابقه جدول ضرب** است.

ساختار کلی اجرای Production روی Linux VPS:

```text
GitHub
   ↓
Project Files
   ↓
Python Virtual Environment
   ↓
FastAPI
   ↓
Uvicorn
   ↓
systemd
   ↓
SQLite (game.db)
```

فرآیند پیشنهادی نصب:

```text
نصب
 ↓
بررسی
 ↓
تست دستی
 ↓
Backup دیتابیس
 ↓
راه‌اندازی systemd
 ↓
بررسی Service
 ↓
بررسی مرورگر
 ↓
استفاده از برنامه
```

**Zarb Table Game**

بازی آموزشی جدول ضرب برای تمرین، آموزش و مسابقه.