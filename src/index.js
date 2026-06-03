import { get_login, set_is_login } from "./components/profile_dropdown.js";
import { api } from "./core/api.js";
import { mock_populate } from "./mock.js";

export const BASE_PATH = "/projeto-arca"

api.init();
document.addEventListener("DOMContentLoaded", async () => {
    let users = await api.get("/get-users")
    if (users.length === 0) {
        mock_populate();
    }
})

lucide.createIcons();
const notifMenuBtn = document.getElementById('notifMenuBtn');
const notifDropdown = document.getElementById('notifDropdown');

notifMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.remove('user-dropdown--open');
    notifDropdown.classList.toggle('notif-dropdown--open');
});
document.addEventListener('click', (e) => {
    if (!document.getElementById('notifMenu').contains(e.target)) {
        notifDropdown.classList.remove('notif-dropdown--open');
    }
});

document.querySelector('.notif-dropdown__mark-all').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.notif-item--unread').forEach(item => {
        item.classList.remove('notif-item--unread');
        const dot = item.querySelector('.notif-item__dot');
        if (dot) dot.remove();
    });
    document.querySelector('.notification-dot').style.display = 'none';
});

document.querySelectorAll('.modal__tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.modal__tab').forEach(t => t.classList.remove('modal__tab--active'));
        tab.classList.add('modal__tab--active');
        document.getElementById('tabLogin').classList.add('modal__form--hidden');
        document.getElementById('tabRegister').classList.add('modal__form--hidden');
        document.getElementById(target === 'login' ? 'tabLogin' : 'tabRegister').classList.remove('modal__form--hidden');
    });
});

document.querySelectorAll('[data-switch]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.switch;
        document.querySelectorAll('.modal__tab').forEach(t => {
            t.classList.toggle('modal__tab--active', t.dataset.tab === target);
        });
        document.getElementById('tabLogin').classList.toggle('modal__form--hidden', target !== 'login');
        document.getElementById('tabRegister').classList.toggle('modal__form--hidden', target !== 'register');
    });
});

const togglePassword = document.getElementById('togglePassword');
const loginPassword = document.getElementById('loginPassword');
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const isPass = loginPassword.type === 'password';
        loginPassword.type = isPass ? 'text' : 'password';
        togglePassword.innerHTML = isPass
            ? '<i data-lucide="eye-off"></i>'
            : '<i data-lucide="eye"></i>';
        lucide.createIcons();
    });
}

const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu--open');
});

const login_form = document.getElementById("tabLogin");
if (login_form) {
    login_form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(login_form);
        const data = Object.fromEntries(formData);

        const logged = await api.put("/user-login", data);
        if (logged) {
            console.log("Login successful");
            window.location.href = `${BASE_PATH}/index.html`
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

document.getElementById("test").addEventListener("click", async (e) => {
    if (e.target.closest("#exit")) {
        e.preventDefault();

        console.log("login out");

        await api.delete("/delete-session");
        window.location.href = ` ${BASE_PATH}/index.html`;
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
    window.location.href = `${BASE_PATH}/views/denuncia.html`
})

const adopt_btn = document.getElementById("adopt-btn");
if (adopt_btn) {
    adopt_btn.addEventListener("click", () => {
        window.location.href = `${BASE_PATH}/views/adocao.html`
    })
}
