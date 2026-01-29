// ---------------------- تنظیمات ----------------------
let players = [];
let families = [];
let totalQuestions = 10;
let timePerQuestion = 20;

let playWithBot = false;
let botDifficulty = "easy";

const botProfile = {
    easy:   { correct: 0.3, wrong: 0.4, timeout: 0.3 },
    medium: { correct: 0.55, wrong: 0.3, timeout: 0.15 },
    hard:   { correct: 0.9, wrong: 0.08, timeout: 0.02 }
};

let game = {
    currentPlayerIndex: 0,
    scores: [],
    questionCount: 0,
    questions: [],
    finished: false
};

let timerInterval;
let timeLeft = 0;

// ---------------------- بارگذاری بازیکن ها از دیتابیس ----------------------
async function loadPlayers() {
    try {
        const res = await fetch("/api/load-players");
        const players = await res.json(); // لیست نام بازیکن‌ها

        for (let i = 1; i <= 4; i++) {
            const select = document.getElementById(`player${i}`);
            // حذف گزینه‌های قبلی به جز placeholder
            select.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());

            players.forEach(p => {
                const option = document.createElement("option");
                option.value = p;
                option.textContent = p;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error("خطا در دریافت بازیکن‌ها:", err);
    }
}

// هنگام load شدن صفحه کمبوها پر شوند
document.addEventListener("DOMContentLoaded", () => {

    // بارگذاری بازیکن‌ها
    loadPlayers();

    // کنترل UI ربات
    const botToggle = document.getElementById("bot-toggle");
    const botLevel  = document.getElementById("bot-level");

    if (botToggle && botLevel) {
        botToggle.addEventListener("change", () => {
            botLevel.disabled = !botToggle.checked;
            if (!botToggle.checked) {
                botLevel.value = "";
            }
        });
    }
});

// ---------------------- بارگذاری جایزه‌ها ----------------------
let rewards = [];
fetch("/static/rewards.json")
    .then(res => res.json())
    .then(data => { rewards = data; })
    .catch(err => console.error("Error loading rewards.json:", err));

// ---------------------- شروع بازی ----------------------
function startGame() {
    // -------------------- جمع‌آوری بازیکن‌های انسانی --------------------
    let humanPlayers = [];
    for (let i = 1; i <= 4; i++) {
        const val = document.getElementById(`player${i}`).value;
        if (val) humanPlayers.push({ name: val, type: "human" });
    }

    // چک تکراری بودن بازیکن‌ها
    if (new Set(humanPlayers.map(p => p.name)).size !== humanPlayers.length) {
        alert("❌ بازیکن تکراری انتخاب شده!");
        return;
    }

    // -------------------- وضعیت ربات --------------------
    playWithBot = document.getElementById("bot-toggle").checked;
    botDifficulty = document.getElementById("bot-level").value;

    if (playWithBot && !botDifficulty) {
        alert("❌ لطفاً سطح ربات را انتخاب کنید");
        return;
    }

    if (playWithBot && humanPlayers.length > 3) {
        alert("❌ در حالت بازی با کامپیوتر، حداکثر ۳ بازیکن انسانی مجاز است");
        return;
    }

    // -------------------- آرایه نهایی شرکت‌کننده‌ها --------------------
    const participants = [...humanPlayers];

    if (playWithBot) {
        participants.push({
            name: "🤖 کامپیوتر",
            type: "bot",
            level: botDifficulty
        });
    }

    // اعتبارسنجی حداقل دو شرکت‌کننده
    if (participants.length < 2) {
        alert("حداقل دو شرکت‌کننده لازم است!");
        return;
    }

    // -------------------- جمع‌آوری خانواده‌های ضرب --------------------
    families = [...document.querySelectorAll(".families input:checked")]
        .map(i => parseInt(i.value));

    if (families.length === 0) {
        alert("❌ حداقل یک خانواده ضرب انتخاب شود!");
        return;
    }

    // -------------------- تنظیمات بازی --------------------
    totalQuestions = parseInt(document.getElementById("questions").value);
    timePerQuestion = parseInt(document.getElementById("time").value);

    // آرایه participants را به global players تبدیل می‌کنیم تا بقیه کد با آن سازگار باشد
    players = participants.map(p => p.name);

    game = {
        currentPlayerIndex: 0,
        scores: Array(players.length).fill(0),
        questionCount: 0,
        questions: generateQuestions(),
        finished: false,
        participants // نگه داشتن اطلاعات نوع و سطح ربات برای منطق بعدی
    };

    // -------------------- شروع بازی --------------------
    document.getElementById("settings-modal").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    updateScores();
    loadQuestion();
}

// ---------------------- تولید سوال ----------------------
function generateQuestions(){
    let qs = [];
    if(families.length === 0) return qs;

    // تولید همه سوال‌های ممکن از خانواده انتخاب شده
    let allQuestions = [];
    for(let f of families){
        for(let i=1;i<=9;i++){
            allQuestions.push({a:f,b:i,answer:f*i});
        }
    }

    // اگر تعداد سوال بیشتر از تعداد سوالات یکتا بود، می‌توانیم آنها را تکرار کنیم
    while(qs.length < totalQuestions){
        let shuffled = [...allQuestions];
        // shuffle
        for(let i=shuffled.length-1;i>0;i--){
            let j = Math.floor(Math.random()*(i+1));
            [shuffled[i],shuffled[j]] = [shuffled[j],shuffled[i]];
        }
        for(let q of shuffled){
            qs.push(q);
            if(qs.length >= totalQuestions) break;
        }
    }

    return qs.slice(0,totalQuestions);
}

// ---------------------- نمایش سوال ----------------------
function loadQuestion() {
    if (game.questionCount >= totalQuestions) {
        endGame();
        return;
    }

    const q = game.questions[game.questionCount];
    document.getElementById("question").innerText = `${q.a} × ${q.b} = ?`;
    document.getElementById("answer").value = "";
    document.getElementById("result").innerText = "";
    document.getElementById("player").innerText = `نوبت: ${players[game.currentPlayerIndex]}`;
    document.getElementById("question-number").innerText =
        `سوال ${game.questionCount + 1} از ${totalQuestions}`;

    startTimer(timePerQuestion);

    if (players[game.currentPlayerIndex] === "🤖 کامپیوتر") {
        botPlayWithTimer();
    }
}

// ---------------------- مغز واقعی ربات 🤖 ----------------------
function botPlayWithTimer() {
    const profile = botProfile[botDifficulty];
    const q = game.questions[game.questionCount];

    const r = Math.random();
    let action;

    if (r < profile.correct) action = "correct";
    else if (r < profile.correct + profile.wrong) action = "wrong";
    else action = "timeout";

    // زمان پاسخ تصادفی داخل تایمر
    const minDelay = 1000;
    const maxDelay = (timePerQuestion - 1) * 1000;
    const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

    if (action === "timeout") {
        // کاری نکن → تایمر خودش sendAnswer(true) را صدا می‌زند
        return;
    }

    setTimeout(() => {
        if (players[game.currentPlayerIndex] !== "🤖 کامپیوتر") return;

        let value;
        if (action === "correct") {
            value = q.answer;
        } else {
            do {
                value = Math.floor(Math.random() * 81) + 1;
            } while (value === q.answer);
        }

        document.getElementById("answer").value = value;
        sendAnswer(false);
    }, delay);
}

// ---------------------- تایمر ----------------------
function startTimer(seconds){
    clearInterval(timerInterval);
    timeLeft = seconds;
    const timerText = document.getElementById("timer-text");
    timerText.style.color = "blueviolet";
    timerText.style.animation = ""; // ریست لرزش
    timerText.innerText = timeLeft;

    // مقدار اولیه دایره
    updateTimerCircle(0, seconds);

    timerInterval = setInterval(()=>{
        timeLeft--;
        timerText.innerText = timeLeft;

        // ۳ ثانیه آخر
        if(timeLeft <= 3 && timeLeft > 0){
            timerText.style.color = "red";
            timerText.style.animation = "shake 0.3s infinite";
        } else if(timeLeft > 3){
            timerText.style.color = "blueviolet";
            timerText.style.animation = "";
        }

        if(timeLeft <= 0){ 
            clearInterval(timerInterval); 
            timerText.style.color = "blueviolet";
            timerText.style.animation = "";
            sendAnswer(true); 
        }

        updateTimerCircle(seconds - timeLeft, seconds);
    }, 1000);
}

// بروزرسانی دایره SVG
function updateTimerCircle(elapsed, total){
    const circle = document.getElementById("timer-circle-progress");
    const radius = 28; // مطابق r در SVG
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - elapsed / total);
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
}

// ---------------------- محدود کردن جواب به اعداد فقط و Enter ----------------------
const answerInput = document.getElementById("answer");

answerInput.addEventListener("input", function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});

answerInput.addEventListener("keyup", e => {
    if(e.key === "Enter") sendAnswer();
});

// ---------------------- ثبت جواب ----------------------
function sendAnswer(timeout=false){
    clearInterval(timerInterval);
    const q = game.questions[game.questionCount];
    const val = timeout?null:parseInt(document.getElementById("answer").value);
    const correct = val===q.answer;
    document.getElementById("result").innerText = correct ? " 🎉 آفرین 🎉 " : `❌ اشتباه ❌ 
     جواب صحیح : ${q.answer} ✅`;
    if(correct) game.scores[game.currentPlayerIndex]++;

    // ذخیره پاسخ هر سوال به API
    fetch("/answer", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({answer: val, player: players[game.currentPlayerIndex], question: `${q.a}x${q.b}`})
    }).catch(err=>console.error(err));

    game.questionCount++;
    game.currentPlayerIndex=(game.currentPlayerIndex+1)%players.length;
    updateScores();
    setTimeout(loadQuestion,1500);
}

// ---------------------- نمایش امتیاز ----------------------
function updateScores(){
    const scoresList = document.getElementById("scores-list");
    scoresList.innerHTML = "";

    const maxScore = Math.max(...game.scores);

    for (let i = 0; i < players.length; i++) {
        const div = document.createElement("div");
        div.classList.add("score-item");

        // لیدر (یا لیدرهای مساوی)
        if (game.scores[i] === maxScore && maxScore > 0) {
            div.classList.add("leader");
            div.innerHTML = `👑 ${players[i]} : ${game.scores[i]} امتیاز`;
        } else {
            div.innerText = `${players[i]} : ${game.scores[i]} امتیاز`;
        }

        scoresList.appendChild(div);
    }
}

// ---------------------- پایان بازی ----------------------
function endGame(){
    game.finished = true;
    clearInterval(timerInterval);

    const maxScore = Math.max(...game.scores);
    const winnersIndexes = game.scores
        .map((score,i) => score === maxScore ? i : -1)
        .filter(i => i !== -1);

    let scoresDict = {};
    for(let i = 0; i < players.length; i++){
        scoresDict[players[i]] = game.scores[i];
    }

    fetch("/finish", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({players, scores: scoresDict})
    }).catch(err => console.error(err));

    if(winnersIndexes.length === 1){
        // یک برنده
        const winner = players[winnersIndexes[0]];
        showRewardPopup(winner);
    } else {
        // حالت تساوی
        const tiedPlayers = winnersIndexes.map(i => players[i]).join(", ");
        
        rewardModal.classList.remove("hidden");
        rewardCloud.classList.add("show");
        rewardDisplay.classList.remove("hidden"); // نمایش دکمه‌های Restart/Home
        spinBtn.style.display = "none";           // مخفی کردن گردونه
        rewardCloudText.innerText = `⚖️ تساوی بین: ${tiedPlayers}`;
    }
}

// ---------------------- گردونه جایزه ----------------------
const rewardModal=document.getElementById("reward-modal");
const winnerNameEl=document.getElementById("winner-name");
const spinBtn=document.getElementById("spin-btn");
const rewardDisplay=document.getElementById("reward-display");
const rewardCloud=document.getElementById("reward-cloud");
const rewardCloudText=document.getElementById("reward-cloud-text");
const canvas=document.getElementById("wheel");
const ctx=canvas.getContext("2d");
const size=canvas.width;
const center=size/2;
const radius=size/2-20;

let spinning=false;
let rewardReceived=false;

// ---------------------- رسم گردونه ----------------------
function drawWheel(){
    if(rewards.length===0) return;
    const angle = 2*Math.PI/rewards.length;
    ctx.clearRect(0,0,size,size);

    const defaultColors = ["#f44336","#e91e63","#9c27b0","#3f51b5","#2196f3","#009688","#4caf50","#ff9800","#ffeb3b","#795548"];

    for(let i=0;i<rewards.length;i++){
        const start = i*angle;
        const end = start+angle;
        ctx.beginPath();
        ctx.moveTo(center,center);
        ctx.arc(center,center,radius,start,end);
        ctx.fillStyle = rewards[i].color || defaultColors[i % defaultColors.length];
        ctx.fill(); ctx.stroke();
        ctx.save();
        ctx.translate(center,center);
        ctx.rotate(start+angle/2);
        ctx.textAlign="right";
        ctx.fillStyle="#fff";
        ctx.font="16px Arial";
        ctx.fillText(rewards[i].name,radius-10,5);
        ctx.restore();
    }
}

// ---------------------- نمایش جایزه ----------------------
function showRewardPopup(winner){
    
    winnerNameEl.innerText = winner;
    rewardReceived = false;
    spinBtn.disabled = false;
    spinBtn.style.display = "inline-block"; 
    drawWheel();
    rewardDisplay.classList.add("hidden");
    rewardCloud.classList.remove("show");
    rewardModal.classList.remove("hidden");
}

// ---------------------- چرخش گردونه ----------------------
spinBtn.onclick = ()=>{
    if(spinning || rewardReceived) return;
    spinning = true;
    spinBtn.disabled = true;
    const rotations = Math.random()*5+5;
    const finalAngle = Math.random()*2*Math.PI;
    const totalRotation = rotations*2*Math.PI + finalAngle;
    let start = null;

    function animate(timestamp){
        if(!start) start = timestamp;
        const progress = timestamp - start;
        const ease = 1 - Math.pow(1 - progress/3000, 3);
        canvas.style.transform = `rotate(${totalRotation*ease}rad)`;
        if(progress < 3000){
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            rewardReceived = true;

            const anglePer = 2*Math.PI/rewards.length;
            let index = Math.floor((2*Math.PI - (totalRotation % (2*Math.PI)))/anglePer) % rewards.length;
            const reward = rewards[index];

            rewardCloudText.innerText = `🎁 ${reward.name} - ${reward.desc}`;
            rewardCloud.classList.add("show");
            rewardDisplay.classList.remove("hidden");

            spinBtn.disabled = true;
            spinBtn.style.display = "none";
        }
    }
    requestAnimationFrame(animate);
};

// ---------------------- دکمه‌ها ----------------------
document.getElementById("restart-btn").onclick = ()=>{
    rewardCloud.classList.remove("show");
    rewardModal.classList.add("hidden");
    spinBtn.disabled = false;
    spinBtn.style.display = "inline-block";
    startGame();
};

document.getElementById("home-btn").onclick = ()=>{
    rewardCloud.classList.remove("show");
    rewardModal.classList.add("hidden");
    spinBtn.disabled = false;
    spinBtn.style.display = "inline-block";
    document.getElementById("game").classList.add("hidden");
    document.getElementById("settings-modal").classList.remove("hidden");
};
