import { api } from "../api.js";

async function main() {
    const form = document.getElementById("login-form");
    let action = null;
    form.addEventListener("click", (event) => {
        event.stopPropagation();

        if (event.target.tagName === "BUTTON") {
            action = event.target.dataset.action;
        }
    })

    form.addEventListener("submit", async (event) => {
        event.preventDefault()

        console.log("prevent default")

        const form_data = new FormData(form)

        const form_body = {
            name: form_data.get("name"),
            email: form_data.get("email"),
            passwd: form_data.get("passwd")
        }

        let url;

        if (action === "login") {
            url = "http://127.0.0.1:8000/api/v1/user/login"
        }
        if (action === "register") {
            url = "http://127.0.0.1:8000/api/v1/user/create"
        }

        const response = await api(url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },

            body: form_body
        }
        );

        //Verificação de role do usuario
        if (action === "login") {
            /* Devemos guardar esse token, ele será o nosso autorizador de login*/
            const session = { user: response.data.user, email: response.data.email, role: response.data.role, token: response.data.token }
            localStorage.setItem('session', JSON.stringify(session));
            console.log('data:', JSON.parse(localStorage.getItem('session')));

            if (response.data.role == 'admin') {
                console.log("admin Login efetuado com sucesso");
                window.location.href = "./adminPanel.html"
            }
            if(response.data.role == 'user'){
                console.log("login efetuado com sucesso");
                window.location.href = "../index.html"
            }


        }
    })

}

main();

async function get_user() {
    let response = await api(
        'http://127.0.0.1:8000/api/v1/get_user'
    )

    console.log('fetch object:', response)
    let response_json = await response.data.json();
    console.log('response object', response_json)
    return response_json
}

function toggle_login_modal() {
    const modal = document.getElementById("login-modal")
    modal.classList.toggle("active")
}