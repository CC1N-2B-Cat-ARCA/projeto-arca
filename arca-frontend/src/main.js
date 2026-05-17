async function main(){
    let response = await fetch("http://127.0.0.1:8000/api/v1/teste")
    console.log('fetch object:',response)
    let response_text = await response.json();
    console.log('response_object:',response_text)    
    let response_element = document.createElement("p")

    let user_element = document.createElement("p")

    response_element.textContent = `resposta da api: ${JSON.stringify(response_text)}` 
    user_element.textContent = `usuario: ${JSON.stringify(await get_user())}`
    
    document.body.appendChild(response_element)
    document.body.appendChild(user_element)

    const open_login = document.getElementById("open-login").addEventListener("click", () => {
        console.log("open login modal")
        toggle_login_modal()
    })

    const modal = document.getElementById("login-modal").addEventListener("click",()=>{
        toggle_login_modal()
    })
    const form = document.getElementById("login-form");

    form.addEventListener("click",(event)=>{
        event.stopPropagation();
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

        const response = await fetch(
            "http://127.0.0.1:8000/api/v1/user", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },

                body: JSON.stringify(form_body)
            }
        );

        const data = await response.json();

        console.log(data);
    })

}

main();

async function get_user(){
    let response = await fetch(
        'http://127.0.0.1:8000/api/v1/get_user'
    )

    console.log('fetch object:',response)
    let response_json = await response.json();
    console.log('response object',response_json)
    return response_json
}

function toggle_login_modal(){
    const modal = document.getElementById("login-modal")
    modal.classList.toggle("active")
}