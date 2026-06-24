import { api } from "../api";

export async function resendVerificationCodeRequest(email) {
    const response = await api.post(
        "/auth/resend-verification-code",
        {
            email
        }
    );

    return response.data;
}