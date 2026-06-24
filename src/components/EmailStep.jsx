import { useState } from "react";
import { forgotPasswordRequest } from "../services/auth/forgotPassword";

export default function EmailStep({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const response = await forgotPasswordRequest(email);

            if (response.success) {
                onSuccess(email);
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Erro ao enviar código"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="password-form">
            <h2 className="password-title">
                Recuperar Senha
            </h2>

            <input
                className="password-input"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {error && (
                <p className="password-error">
                    {error}
                </p>
            )}

            <button
                className="password-button"
                type="submit"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Enviar código"}
            </button>
        </form>
    );
}