import { api } from "../api";

export async function resetPasswordRequest(data) {
    const response = await api.post("auth/reset-password", {
        codigo: data.codigo,
        senha: data.senha
    });

    return response.data;
}