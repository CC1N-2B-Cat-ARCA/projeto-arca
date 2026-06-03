import { get_login, set_is_login } from "./components/profile_dropdown.js";
import { api } from "./core/api.js";
import { mock_populate } from "./mock.js";

api.init();
document.addEventListener("DOMContentLoaded", async () => {
    let users = await api.get("/get-users")
    if (users.length === 0) {
        mock_populate();
    }
})

const login_form = document.getElementById("tabLogin");
if (login_form) {
    login_form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(login_form);
        const data = Object.fromEntries(formData);

        const logged = await api.put("/user-login", data);
        if (logged) {
            console.log("Login successful");
            window.location.href = "../index.html"
        }
    });
}


const reg_form = document.getElementById("tabRegister");
if (reg_form) {
    reg_form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(reg_form);
        const data = { ...Object.fromEntries(formData), role: "user" };
        console.log(data)

        await api.post("/create-user", data);
    });
}

document.addEventListener("click", (e) => {
    console.log("closest", e.target.closest("#exit"))
})

document.getElementById("test").addEventListener("click", async (e) => {
    if (e.target.closest("#exit")) {
        e.preventDefault();

        console.log("login out");

        await api.delete("/delete-session");
        window.location.href = "../index.html";
    }
});

document.addEventListener("keydown", async (e) => {
    if (e.code === "IntlRo") {
        e.preventDefault();
        console.log("calling api");
        console.table(await api.get("/get-users"));
        const session = await api.get("/get-session")
        console.table(session);
        console.table(await api.get("/get-login", session))
    }

});

const report_btn = document.querySelector(".btn--report")
report_btn.addEventListener("click", () => {
    window.location.href = "../views/denuncia.html"
})

const adopt_btn = document.getElementById("adopt-btn");
if (adopt_btn) {
    adopt_btn.addEventListener("click", () => {
        window.location.href = "../views/adocao.html"
    })
}
