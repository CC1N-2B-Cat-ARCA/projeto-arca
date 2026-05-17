export async function api(
    url, {
        method = "GET",
        body = null,
        token = null,
        headers = {}
    } = {}) {

    const final_headers = {
        "Content-Type": "application/json",
        ...headers
    }

    if (token) {
        final_headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method,
        headers: final_headers,
        body: body ? JSON.stringify(body) : null
    });
    let data = null;

    const text = await response.text();

    if(text){
        data = JSON.parse(text);
    }

    if (!response.ok) {
        switch (response.status) {
            case 400:
                alert(response.status+" Bad Request");
                break;
            case 401:
                alert(response.status+"Credenciais inválidas");
                //Deve re-direcionar para login
                break;
            case 403:
                alert(response.status+" Voce não tem autorização pra tal ação");
                break;
            case 404:
                alert(response.status+"Não encontrado")
                break;
            case 409:
                console.log(response.status+" Dados em conflito")
                break;
            case 422:
                console.log(response.status+" Dados invalidos", data)
                break;
            case 500:
                alert(response.status+"Erro interno do servidor");
                break;
        }

        throw new Error(data.message || 'API Error '+response.status);
    }
    return {
        status: response.status,
        data
    };
}