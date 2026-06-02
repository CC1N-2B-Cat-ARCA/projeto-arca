import { api } from "./api.js";
import { render_user_profile } from "./render.js";

async function main() {
    document.addEventListener("DOMContentLoaded", () => {

        const get_user_btn = document.getElementById("get-user");
        get_user_btn.addEventListener("click", async (e) => {
            console.log("calling api");
            console.table(await api.get("/get-users"));
        });

        const get_session_btn = document.getElementById("get-session");
        get_session_btn.addEventListener("click", (e) => {
            e.preventDefault();

            render_user_profile();
        })

        const reg_form = document.getElementById("reg-form");
        reg_form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(reg_form);
            const data = Object.fromEntries(formData);

            await api.post("/create-user", data);
        });

        const login_form = document.getElementById("login-form");
        login_form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(login_form);
            const data = Object.fromEntries(formData);

            const logged = await api.put("/user-login", data);
            if (logged) { render_user_profile(); }
        });

        const profile_pic_form = document.getElementById("profile-pic-form");
        profile_pic_form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(profile_pic_form);
            const data = Object.fromEntries(formData);
            await api.put("/update-user", {
                name: data.name,
                update: data
            });
        })

        const delete_form = document.getElementById("delete-form");
        delete_form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(delete_form);
            const data = Object.fromEntries(formData);
            await api.delete("/delete-user", {
                id: data.id
            });
        })
    });
}

main();