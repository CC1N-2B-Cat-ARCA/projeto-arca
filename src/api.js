export const api = {
    
    init: function(){
        create_table("users");
        create_table("session");
    },
    get: async function (request, data = {}) {
        switch (request) {
            case "/get-users": {
                let users = get_table("users");
                return users
            }
            case "/get-session": {
                let session = get_table("session");
                return session
            }
            case "/get-login": {
                let users = get_table("users")
                let user;

                for (const user_id in users) {
                    if (users[user_id].auth_token != data.user.auth_token) continue;
                    user = users[user_id];
                }
                return user || {};
            }
        }
    },
    post: async function (request, data) {
        switch (request) {
            case "/create-user": {
                let users = get_table("users");
                const nextId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;

                users.push({
                    ...data,
                    id: nextId
                });
                localStorage.setItem("users", JSON.stringify(users))
                break;
            }
        }
    },
    put: async function (request, data) {
        switch (request) {
            case "/update-user": {
                let users = get_table("users");

                for (const user_id in users) {
                    if (users[user_id].name === data.name || users[user_id].email === data.email) {
                        const up_data = {
                            ...users[user_id],
                            ...data.update,
                            id: users[user_id].id
                        }
                        users[user_id] = up_data
                        console.log("Updating user", up_data)
                        localStorage.setItem("users", JSON.stringify(users))
                        return;
                    }
                }
                console.error("404 - user not found")
                window.alert("404 - user not found")
                return;
            }
            case "/user-login": {
                let users = get_table("users");

                let logged = false;

                async function gerarHash(string) {
                    const buffer = new TextEncoder().encode(string);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
                }

                for (const user_id in users) {
                    if (users[user_id].email != data.email) continue;
                    if (users[user_id].passwd != data.passwd) continue;

                    const num = Math.random()
                    const auth_token = await gerarHash(`${num}`);

                    const up_data = {
                        ...users[user_id],
                        auth_token: auth_token
                    }

                    users[user_id] = up_data;
                    localStorage.setItem("users", JSON.stringify(users));
                    localStorage.setItem("session", JSON.stringify({ user: { auth_token: up_data.auth_token } }));

                    logged = true;
                    return logged;
                }

                if (!logged) {
                    console.error("405 - Credenciais invalidas")
                    window.alert("405 - Credenciais invalidas")

                };
                return logged;
            }
        }
    },
    delete: async function (request, data) {
        switch (request) {
            case "/delete-user": {
                const users = get_table("users");
                const updatedUsers = users.filter(
                    user => {
                        return user.id !== Number(data.id);
                    }
                );
                localStorage.setItem("users", JSON.stringify(updatedUsers));
                break;
            }
        }
    }
}

function get_table(table_name) {
    try {
        return JSON.parse(localStorage.getItem(table_name) || []);
    } catch {
        console.error(`404 - Table "${table_name}" not found`)
        window.alert(`404 - Table "${table_name}" not found`)
        return [];
    }
}

export function create_table(table_name){
    if(localStorage.getItem(table_name) === null) {
        localStorage.setItem(table_name, JSON.stringify([]))
    }  
}