import { api } from "./api.js";

export async function render_user_profile() {
    const session = await api.get("/get-session");
    const user = await api.get("/get-login", session)

    if( Object.keys(user).length === 0 || user === undefined){ 
        console.error("404 - Sessão de usuario não encontrada")
        window.alert("404 - Sessão de usuario não encontrada")
        return;
    }
    const place_holder = "https://c.l3n.co/XjTg7c.jpg"
    const card =
    `
            <div class="user-card">
                <img src="${user.avatar || place_holder}" alt="user_profile" class="user-avatar">
                <div class="user-info">
                   <h4>Nome: ${user.name}</h4> 
                   <h4>Email: ${user.email}</h4> 
                   <h4>Token: ${user.auth_token}</h4> 
                </div>
            </div>
        
    `
    const user_profile = document.getElementById("user-profile");
    user_profile.innerHTML = '';
    user_profile.innerHTML = card;
}