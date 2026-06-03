import { api } from "./core/api.js";

export function mock_populate(){
    
    const data = {name: 'zeri', cpf: '57257457257', email: 'zeri@bestadc.com', passwd: 'bestadc', role: 'user', avatar: 'https://a.l3n.co/XjTW8e.jpg'}
    const tutor = {name: 'tutor', cpf: '85274196385', email: 'tutor@tutor.com', passwd: '123456', role: 'user', avatar: 'https://a.l3n.co/XjTW8e.jpg'}
    const candidato = {name: 'candidato', cpf: '45678912345', email: 'candidato@cand.com', passwd: 'cand!098', role: 'user', avatar: 'https://a.l3n.co/XjTrUK.jpg'}
    const ong = {name: 'ong', cpf: '14725836914', email: 'ong@ong.com', passwd: 'ong$-135', role: 'ong', avatar:'https://a.l3n.co/XjTrUK.jpg'}
    const prefeitura = {name: 'Prefeitura', cpf: '45678912345', email: 'admin@admin.com', passwd: 'pref@456', role:'adm', avatar:'https://b.l3n.co/XjTiQk.jpg'}

    api.post("/create-user", data);
    api.post("/create-user", ong);
    api.post("/create-user", prefeitura);
    api.post("/create-user", tutor);
    api.post("/create-user", candidato);
}