import { api } from "../api";

export async function forgotPasswordRequest(email) {
    const response = await api.post("auth/forgot-password", {
        email
    });

    return response.data;
}