import { api } from "../api.js";

async function get_login() {
    const login = localStorage.getItem('user');

    if (!login) {
        throw new Error("Algo de MUITO errado não está certo");
        return;
    }

    const login_container = document.getElementById('user-profile');
    const profile = `   <h1>Perfil</h1>
                        <h2>Nome: <span id="profile-name">${login.name}</span></h2>
                        <h2>Email: <span id="profile-email">${login.email}</span></h2>
                        <h2>Role: <span id="profile-role">${login.role}</span></h2>
                    `;
    login_container.innerHTML = profile;
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
    //Deleta a databse inteira!
    
    const url = "http://127.0.0.1:8000/api/v1/admin/purge"
    const response = await api(url,
        {
        method:"DELETE",
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

    return response;
    console.log("Database Purged")
}

async function main(){
    const login = {name:"Ferdinand",email:"ferdinand@gmail.com",role:"admin"}
    //const login = null;
    get_login()

    const purge_button = document.getElementById("purge-button")
    purge_button.addEventListener("click",async ()=>{
        console.log(await purge());
    })

    const search_all_button = document.getElementById("search-all-users");
    search_all_button.addEventListener("click", async ()=>{
        console.log(await getusers());
    });
} 
main()


