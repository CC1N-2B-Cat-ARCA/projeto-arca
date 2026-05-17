import { api } from "../api.js";

async function get_login() {
    const login = JSON.parse(localStorage.getItem('session'));

    if (!login || login.role !== "admin") {
        alert("Acesso Inautorizado",403);
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

export async function showUsers() {
    //Search all showUsers
    const users = await getUsers();
    //create user card elements on each user
    const fragment = document.createDocumentFragment();
    //append to fragment
    for (const user of users) {
        const card = createCard(user)
        fragment.appendChild(card)
    }
    const output_container = document.getElementById('card-container')
    output_container.replaceChildren();
    output_container.appendChild(fragment);
}

export async function getusers() {
    //faz request pra api requisitando todos os users
    const url = "http://127.0.0.1:8000/api/v1/users"
    const response = await api(url);

    return response;
}

export async function authGetusers() {
    //faz request pra api requisitando todos os users
    const token = localStorage.getItem('auth_token');

    const url = "127.0.0.1:8000/api/v1/admin/users"
    const response = await api(url, {
        method: "GET",
        token: token,
    });

    return response
}

async function purge(){
    //Deleta a database inteira!
    
    const url = "http://127.0.0.1:8000/api/v1/admin/purge"
    const token = JSON.parse(localStorage.getItem('session')).token
    console.log("token:",
        JSON.parse(localStorage.getItem('session')).token,
    )
    const response = await api(url,
        {
        method:"DELETE",
        body:{token:token},
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

    return response;
}

async function promote(){
    
}

async function main(){
    //const login = {name:"Ferdinand",email:"ferdinand@gmail.com",role:"admin"}
    //const login = null;
    const login = await get_login();

    if(!login){
        console.log("redirecionando para login")
        window.location.replace("./admin.html")
        //redirect to admin login page
        return;
    }

    const promote_form = document.getElementById("promote-form");
    promote_form.addEventListener("submit",async (event) =>{
        event.preventDefault();

        const form_data = new FormData(promote_form);
        const auth_token = JSON.parse(localStorage.getItem('session')).token
        console.log(auth_token);
        const form_body = {
           token: auth_token,
            "email":form_data.get("email")
        }

        const url = "http://127.0.0.1:8000/api/v1/admin/promote"
        const response = await api(url, {
            method: "POST",

            headers:{
                "Content-Type": "application/json",
                "accept":"application/json"
            },

            body: form_body
        });

        console.log(response.status,response.data.message)
    })

    const purge_button = document.getElementById("purge-button")
    purge_button.addEventListener("click",async ()=>{
        const purge_it = await purge();
        console.log(purge_it.data.message,purge_it.status);
    })

    const search_all_button = document.getElementById("search-all-users");
    search_all_button.addEventListener("click", async ()=>{
        console.log(await getusers());
    });
} 
main()


