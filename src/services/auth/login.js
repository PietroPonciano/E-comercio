import { api } from "../api";

export async function loginRequest(data) {
    const response = await api.post("api/auth/login", {
        email: data.email,
        senha: data.senha
    });

    const { token } = response.data.data;

    sessionStorage.setItem("token", token);

    return response.data;
}