import { api } from "../api";

export async function resetPasswordRequest(email, data) {
    const response = await api.post("auth/reset-password", {
        email,
        codigo: data.codigo,
        novaSenha: data.senha
    });

    return response.data;
}