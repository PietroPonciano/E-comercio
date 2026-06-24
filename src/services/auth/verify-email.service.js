import { api } from "../api";

export async function verifyEmailRequest(data) {
    const response = await api.post(
        "auth/verify-email",
        {
            email: data.email,
            codigo: data.codigo
        }
    );

    return response.data;
}