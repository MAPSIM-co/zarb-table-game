// ---------------------- بررسی دسترسی در ورود ----------------------
document.addEventListener("DOMContentLoaded", () => {
    const adminId = sessionStorage.getItem("admin_id");
    const isSuperAdmin = sessionStorage.getItem("is_superadmin");

    // اگر لاگین نکرده
    if (!adminId) {
        window.location.href = "/admin/index.html";
        return;
    }

    // اگر سوپرادمین نیست، دکمه افزودن ادمین مخفی شود
    if (isSuperAdmin !== "1") {
        // دکمه دوم (ثبت ادمین جدید)
        const buttons = document.querySelectorAll(".buttons button");
        if (buttons.length >= 2) {
            buttons[1].style.display = "none";
        }
    }
});

// ---------------------- نمایش فرم‌ها ----------------------
function showAddPlayer() {
    document.getElementById("addPlayerDiv").style.display = "block";
    document.getElementById("addAdminDiv").style.display = "none";
}

function showAddAdmin() {
    const isSuperAdmin = sessionStorage.getItem("is_superadmin");
    if (isSuperAdmin !== "1") {
        alert("⛔ فقط سوپرادمین اجازه افزودن ادمین دارد");
        return;
    }

    document.getElementById("addPlayerDiv").style.display = "none";
    document.getElementById("addAdminDiv").style.display = "block";
}

// ---------------------- گزارش ----------------------
function goReport() {
    window.location.href = "/report-ui/index.html";
}

// ---------------------- افزودن بازیکن ----------------------
async function addPlayer() {
    const name = document.getElementById("playerName").value.trim();
    const msg = document.getElementById("playerMsg");
    msg.textContent = "";

    if (!name) {
        msg.style.color = "red";
        msg.textContent = "نام بازیکن را وارد کنید";
        return;
    }

    const formData = new FormData();
    formData.append("name", name);

    try {
        const res = await fetch("/admin/add-player", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            msg.style.color = "green";
            msg.textContent = "✅ بازیکن با موفقیت ثبت شد";
            document.getElementById("playerName").value = "";
        } else {
            msg.style.color = "red";
            msg.textContent = data.detail || data.msg || "خطا";
        }
    } catch (err) {
        msg.style.color = "red";
        msg.textContent = "خطا در ارتباط با سرور";
    }
}

// ---------------------- افزودن ادمین (فقط سوپرادمین) ----------------------
async function addAdmin() {
    const isSuperAdmin = sessionStorage.getItem("is_superadmin");
    if (isSuperAdmin !== "1") {
        alert("⛔ شما اجازه افزودن ادمین ندارید");
        return;
    }

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
    const isSuper = document.getElementById("isSuper").checked ? 1 : 0;
    const msg = document.getElementById("adminMsg");
    msg.textContent = "";

    if (!username || !password) {
        msg.style.color = "red";
        msg.textContent = "نام کاربری و رمز عبور الزامی است";
        return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("is_superadmin", isSuper);
    formData.append("current_admin_id", sessionStorage.getItem("admin_id"));

    try {
        const res = await fetch("/admin/add-admin", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            msg.style.color = "green";
            msg.textContent = "✅ ادمین جدید ثبت شد";
            document.getElementById("adminUsername").value = "";
            document.getElementById("adminPassword").value = "";
            document.getElementById("isSuper").checked = false;
        } else {
            msg.style.color = "red";
            msg.textContent = data.detail || data.msg || "خطا";
        }
    } catch (err) {
        msg.style.color = "red";
        msg.textContent = "خطا در ارتباط با سرور";
    }
}

// ---------------------- خروج از حساب ----------------------
function logout() {
    if (!confirm("آیا می‌خواهید از حساب خارج شوید؟")) return;

    sessionStorage.clear();
    window.location.href = "/admin/index.html";
}