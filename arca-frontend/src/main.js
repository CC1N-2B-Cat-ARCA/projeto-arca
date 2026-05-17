import { api } from "./api.js";

async function get_login() {
    const login = JSON.parse(localStorage.getItem('session'));

    if (!login) {
        console.log("Sem login no momento");
        //throw new Error("Acesso Negado - 403");
        //Redirect para pagina de login aodmin.
        return false;
    }
    console.log(login);
    const login_container = document.getElementById('user-profile');
    const profile = `   <h1>Perfil</h1>
                        <h2>Nome: <span id="profile-name">${login.user}</span></h2>
                        <h2>Email: <span id="profile-email">${login.email}</span></h2>
                        <h2>Role: <span id="profile-role">${login.role}</span></h2>
                    `;
    login_container.innerHTML = profile;
    return true;
}

async function main() {
    let response = await fetch("http://127.0.0.1:8000/api/v1/teste")
    console.log('fetch object:', response)
    let response_text = await response.json();
    console.log('response_object:', response_text)
    let response_element = document.createElement("p")

    response_element.textContent = `resposta da api: ${JSON.stringify(response_text)}`

    document.body.appendChild(response_element)

    const open_login = document.getElementById("open-register").addEventListener("click", () => {
        toggle_modal("register-modal")
    })

    const is_login = get_login();

    const modal = document.getElementById("register-modal").addEventListener("click", () => {
        toggle_modal("register-modal")
    })
    const register_form = document.getElementById("register-form");

    register_form.addEventListener("click", (event) => {
        event.stopPropagation();
    })

    register_form.addEventListener("submit", async (event) => {
        event.preventDefault()

        console.log("prevent default")

        const form_data = new FormData(register_form)

        const form_body = {
            name: form_data.get("name"),
            email: form_data.get("email"),
            passwd: form_data.get("passwd")
        }
        const url = "http://127.0.0.1:8000/api/v1/user/create";
        const response = await api(url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },

            body: form_body
        }
        );

        console.log(response.status, response.data.user, response.data.email);
    })
    const login_button = document.getElementById("open-login")
    login_button.addEventListener("click", () => {
        toggle_modal("login-modal");
    })
    const login_modal = document.getElementById("login-modal")
    login_modal.addEventListener("click", () => {
        toggle_modal("login-modal");
    })

    const login_form = document.getElementById("login-form");
    login_form.addEventListener("click", (event) => {
        event.stopPropagation();
    })
    login_form.addEventListener("submit", async (event)=>{
        await login(event,login_form);
    })
}

main();

async function get_user() {
    let response = await fetch(
        'http://127.0.0.1:8000/api/v1/get_user'
    )

    console.log('fetch object:', response)
    let response_json = await response.json();
    console.log('response object', response_json)
    return response_json
}

function toggle_modal(id) {
    const modal = document.getElementById(id)
    modal.classList.toggle("active")
}

async function login(event,form) {
    event.preventDefault()

    const form_data = new FormData(form)

    const form_body = {
        name: form_data.get("name"),
        email: form_data.get("email"),
        passwd: form_data.get("passwd")
    }

    let url;
    url = "http://127.0.0.1:8000/api/v1/user/login"

    const response = await api(url, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "accept": "application/json"
        },

        body: form_body
    }
    );
    const session = { user: response.data.user, email: response.data.email, role: response.data.role, token: response.data.token }
    localStorage.setItem('session', JSON.stringify(session));
    console.log("admin Login efetuado com sucesso");
    console.log('data:', JSON.parse(localStorage.getItem('session')));
    get_login();
}