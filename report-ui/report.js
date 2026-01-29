document.addEventListener("DOMContentLoaded", function() {
    const selectPlayer = document.getElementById("playerSelect");
    const selectMode = document.getElementById("modeSelect");
    const tableBody = document.getElementById("tableBody");
    const ctx = document.getElementById("chart");
    const tableWrongStats = document.getElementById("tableWrongStats").querySelector("tbody");
    const tableRightStats = document.getElementById("tableRightStats").querySelector("tbody");

    let chart;

    // ---------- بارگذاری بازیکنان ----------
    function loadPlayers() {
        // لیست بازیکنان برای هر دو حالت مسابقه و تمرین یکسانه، اگر لازم شد می‌توانیم جدا کنیم
        fetch("/api/players")
        .then(res => res.json())
        .then(players => {
            selectPlayer.innerHTML = "<option value=''>انتخاب بازیکن</option>";
            players.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p;
                opt.textContent = p;
                selectPlayer.appendChild(opt);
            });
        });
    }

    // ---------- پاکسازی جدول‌ها ----------
    function clearTables() {
        tableBody.innerHTML = "";
        tableWrongStats.innerHTML = "";
        tableRightStats.innerHTML = "";
        if(chart) chart.destroy();
    }

    // ---------- بارگذاری گزارش ----------
    window.loadReport = function() {
        const player = selectPlayer.value;
        const mode = selectMode.value;
        if(!player) return;

        clearTables();

        const baseApi = mode === "practice" ? "/api/practice" : "/api";

        // جدول جواب‌ها
        fetch(`${baseApi}/wrong/${player}`)
        .then(res => res.json())
        .then(rows => {
            tableBody.innerHTML = "";
            rows.forEach(r => {
                const answerText = r.answer === -1 ? '<span style="color:red">Enter</span>' : r.answer;
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${r.question}</td><td>${answerText}</td>`;
                tableBody.appendChild(tr);
            });
        });

        // نمودار درست/غلط
        fetch(`${baseApi}/stats/${player}`)
        .then(res => res.json())
        .then(data => drawChart(data));

        // بیشترین غلط
        fetch(`${baseApi}/wrong-stats/${player}`)
        .then(res => res.json())
        .then(rows => {
            tableWrongStats.innerHTML = "";
            rows.forEach(r => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${r.question}</td><td>${r.wrong_count}</td>`;
                tableWrongStats.appendChild(tr);
            });
        });

        // بیشترین درست
        fetch(`${baseApi}/right-stats/${player}`)
        .then(res => res.json())
        .then(rows => {
            tableRightStats.innerHTML = "";
            rows.forEach(r => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${r.question}</td><td>${r.right_count}</td>`;
                tableRightStats.appendChild(tr);
            });
        });
    }

    // ---------- رسم نمودار ----------
    function drawChart(data) {
        if(chart) chart.destroy();
        chart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["درست", "غلط"],
                datasets: [{
                    data: [data.correct, data.wrong],
                    backgroundColor: ["#4CAF50", "#F44336"]
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: "bottom" } }
            }
        });
    }

    // ---------- بارگذاری اولیه ----------
    loadPlayers();
});