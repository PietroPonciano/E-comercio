import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { verifyEmailRequest } from "../../services/auth/verify-email.service";
import { resendVerificationCodeRequest } from "../../services/auth/resend-email.service";

export default function VerificationStep({ email, onSuccess }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [resendingCode, setResendingCode] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    async function handleVerifyEmail(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await verifyEmailRequest({
                email: email,
                codigo: verificationCode
            });

            // Garante a leitura correta se a resposta vier direto ou dentro de .data (Axios)
            const isSuccess = response?.success || response?.data?.success;

            if (isSuccess) {
                // Se a prop onSuccess existir (vinda do LoginForm), nós a executamos
                if (onSuccess) {
                    onSuccess();
                } else {
                    // Fallback: se o componente for usado em outro lugar sem a prop, ele apenas navega
                    navigate("/login");
                }
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Código inválido");
        } finally {
            setLoading(false);
        }
    }

    async function handleResendCode() {
        try {
            setError("");
            setSuccessMessage("");
            setResendingCode(true);

            const response = await resendVerificationCodeRequest(email);

            if (response.success) {
                setSuccessMessage(response.message || "Código reenviado com sucesso.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Erro ao reenviar código.");
        } finally {
            setResendingCode(false);
        }
    }

    return (
        <form onSubmit={handleVerifyEmail} className="formulario-register">
            <h1>Verifique seu Email</h1>

            <p className="verify-text">
                Enviamos um código para:
                <strong> {email}</strong>
            </p>

            <div>
                <p>Código de verificação</p>
                <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                        type="text"
                        value={verificationCode}
                        placeholder="Digite o código recebido"
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                </div>
            </div>

            <div className="verify-actions">
                <button
                    type="button"
                    className="resend-code-btn"
                    onClick={handleResendCode}
                    disabled={resendingCode}
                >
                    {resendingCode ? "Reenviando..." : "Não recebeu o código? Reenviar"}
                </button>
            </div>

            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Verificando..." : "Confirmar Email"}
            </button>
        </form>
    );
}