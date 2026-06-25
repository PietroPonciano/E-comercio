import { api } from "../api";

export async function loginRequest(data) {
    const response = await api.post("auth/login", {
        email: data.email,
        senha: data.senha
    });


    return response.data;
}