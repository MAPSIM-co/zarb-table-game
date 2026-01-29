// ------------------ variables ------------------
let player = "";
let families = [];
let totalQuestions = 10;
let timePerQuestion = 20;
let game = { scores: {}, questionCount: 0, questions: [], finished: false };
let timerInterval = null;
let timeLeft = 0;

// ------------------ بارگذاری بازیکن‌ها ------------------
async function loadPlayer() {
    try {
        const res = await fetch("/api/load-players");
        const players = await res.json();
        const select = document.getElementById("player");
        select.querySelectorAll('option:not(:first-child)').forEach(o => o.remove());
        players.forEach(p => {
            const option = document.createElement("option");
            option.value = p;
            option.textContent = p;
            select.appendChild(option);
        });
    } catch (err) {
        console.error("خطا در بارگذاری بازیکن‌ها:", err);
    }
}
window.addEventListener("DOMContentLoaded", loadPlayer);

// ------------------ شروع تمرین ------------------
async function startPractice() {
    player = document.getElementById("player").value;
    if (!player) { alert("یک بازیکن انتخاب کنید!"); return; }

    families = [...document.querySelectorAll(".families input:checked")].map(i => parseInt(i.value));
    if (families.length === 0) { alert("حداقل یک خانواده ضرب انتخاب کنید!"); return; }

    totalQuestions = parseInt(document.getElementById("questions").value);
    timePerQuestion = parseInt(document.getElementById("time").value);

    try {
        const res = await fetch("/practice/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player, families, questions: totalQuestions, time: timePerQuestion })
        });
        const data = await res.json();

        console.log("START PRACTICE RESPONSE:", data); // <--- چاپ برای دیباگ

        if (!data.status || data.status !== "practice_started") throw "خطا در شروع تمرین";
        if (!data.questions || data.questions.length === 0) {
            alert("هیچ سوالی برای تمرین موجود نیست.");
            return;
        }

        // استفاده از سوال‌های سرور
        game = {
            scores: { [player]: 0 },
            questionCount: 0,
            questions: data.questions,
            finished: false
        };

        document.getElementById("settings-modal").classList.add("hidden");
        document.getElementById("game").classList.remove("hidden");
        updateScores();
        loadQuestion();

    } catch (err) {
        console.error("خطا در شروع تمرین:", err);
        alert("شروع تمرین با مشکل مواجه شد!");
    }
}

// ------------------ بارگذاری سوال ------------------
function loadQuestion() {
    if (!game.questions || game.questions.length === 0) {
        console.error("game.questions خالی است!");
        return;
    }

    if (game.questionCount >= game.questions.length) { endGame(); return; }
    const q = game.questions[game.questionCount];
    document.getElementById("question").innerText = `${q.a} × ${q.b} = ?`;
    document.getElementById("answer").value = "";
    document.getElementById("result").innerText = "";
    document.getElementById("player-name").innerText = `بازیکن: ${player}`;
    document.getElementById("question-number").innerText = `سوال ${game.questionCount + 1} از ${game.questions.length}`;
    startTimer(timePerQuestion);
}

// ------------------ دریافت جواب ------------------
const answerInput = document.getElementById("answer");
answerInput.addEventListener("input", function () { this.value = this.value.replace(/[^0-9]/g, ''); });
answerInput.addEventListener("keyup", e => { if (e.key === "Enter") sendAnswer(); });

async function sendAnswer(timeout = false) {
    clearInterval(timerInterval);
    if (game.finished) return;

    const q = game.questions[game.questionCount];
    const val = timeout ? -1 : parseInt(document.getElementById("answer").value);

    try {
        const res = await fetch("/practice/answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player, question: `${q.a}x${q.b}`, answer: val })
        });
        const data = await res.json();
        const correct = data.correct;
        const correctAnswer = data.correct_answer;

        document.getElementById("result").innerText = correct ? "🎉 آفرین" : `❌ اشتباه ❌
         جواب صحیح : ${correctAnswer} ✅`;
        if (correct) game.scores[player]++;

        game.questionCount++;
        updateScores();

        setTimeout(loadQuestion, 3000);

    } catch (err) {
        console.error("خطا در ارسال جواب:", err);
        alert("ثبت جواب با مشکل مواجه شد!");
    }
}

// ------------------ بروزرسانی امتیاز ------------------
function updateScores() {
    document.getElementById("score").innerText = game.scores[player] || 0;
}

// ------------------ پایان تمرین ------------------
function endGame() {
    game.finished = true;
    clearInterval(timerInterval);

    // نمایش نتیجه نهایی
    const finalScore = game.scores[player] || 0;
    document.getElementById("result").innerText = `تمرین پایان یافت! امتیاز شما: ${finalScore}`;

    // مخفی کردن بخش بازی
    document.getElementById("game").classList.add("hidden");

    // نمایش صفحه تنظیمات تمرین
    document.getElementById("settings-modal").classList.remove("hidden");

    // ریست کردن state بازی برای تمرین بعدی
    game = { scores: {}, questionCount: 0, questions: [], finished: false };
    player = "";
    families = [];
    totalQuestions = 10;
    timePerQuestion = 20;
}

// ------------------ تایمر ------------------
function startTimer(seconds) {
    clearInterval(timerInterval);
    timeLeft = seconds;
    const timerText = document.getElementById("timer-text");
    timerText.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        if (timeLeft <= 0) { clearInterval(timerInterval); sendAnswer(true); }
    }, 1000);
}