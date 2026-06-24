import { api } from "../api";

export async function registerRequest(data) {
    const payload = {
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        senha: data.senha,
        endereco: data.endereco,
        cpf: data.cpf.replace(/\D/g, "")
    };

    if (data.telefone) {
        payload.telefone = data.telefone.replace(/\D/g, "");
    }

    const response = await api.post("auth/register", payload);

    return response.data;
}