document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const msgEl = document.getElementById("msg");
    msgEl.textContent = "";
    msgEl.style.color = "red";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        msgEl.textContent = "نام کاربری و رمز عبور را وارد کنید";
        return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
        const res = await fetch("/admin/login", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            msgEl.textContent = "خطا در ارتباط با سرور";
            return;
        }

        const data = await res.json();

        if (data.success) {
            // ذخیره اطلاعات ادمین
            sessionStorage.setItem("admin_id", data.admin_id);
            sessionStorage.setItem("is_superadmin", data.is_superadmin);

            // انتقال به پنل
            window.location.href = "/admin/panel.html";
        } else {
            msgEl.textContent = data.msg || "خطا در ورود";
        }

    } catch (err) {
        console.error(err);
        msgEl.textContent = "سرور در دسترس نیست";
    }
});