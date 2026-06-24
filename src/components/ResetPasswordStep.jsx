import { useState } from "react";
import { resetPasswordRequest } from "../services/auth/resetPassword";

export default function ResetPasswordStep() {
    const [codigo, setCodigo] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const response = await resetPasswordRequest({
                codigo,
                senha
            });

            if (response.success) {
                setSuccess("Senha alterada com sucesso.");
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Erro ao redefinir senha"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="password-form">
            <h2 className="password-title">
                Redefinir Senha
            </h2>

            <input
                className="password-input"
                type="text"
                placeholder="Código recebido"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
            />

            <input
                className="password-input"
                type="password"
                placeholder="Nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            {error && (
                <p className="password-error">
                    {error}
                </p>
            )}

            {success && (
                <p className="password-success">
                    {success}
                </p>
            )}

            <button
                className="password-button"
                type="submit"
                disabled={loading}
            >
                {loading ? "Alterando..." : "Alterar senha"}
            </button>
        </form>
    );
}