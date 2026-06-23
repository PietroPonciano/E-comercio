import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/auth/login";
import { loginSchema } from "../schemas/loginSchema";
import { useAuth } from "../context/AuthContext";

import "../styles/Login.styles.css";

export default function LoginForm() {
    const { login } = useAuth();

    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        email: "",
        senha: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError(null);

        const result = loginSchema.safeParse(form);

        if (!result.success) {
            setError(result.error?.issues?.[0]?.message || "Erro de validação");
            return;
        }

        try {
            setLoading(true);

            const response = await loginRequest({
                email: form.email,
                senha: form.senha
            });
            
            login(response.data.token);
            
            navigate("/");

            
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Erro ao fazer login"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <h1>Login</h1>

            <form onSubmit={handleSubmit} className="formulario-login">
                <div>
                    <p>Email</p>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                email: e.target.value
                            }))
                        }
                    />
                </div>

                <div>
                    <p>Senha</p>
                    <input
                        type="password"
                        value={form.senha}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                senha: e.target.value
                            }))
                        }
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}