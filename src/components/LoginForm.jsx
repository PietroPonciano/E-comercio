import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Package, UserPlus } from "lucide-react"; 
import { loginRequest } from "../services/auth/login";
import { loginSchema } from "../schemas/loginSchema";
import { useAuth } from "../context/AuthContext";

// Importando o componente de verificação
import VerificationStep from "./VerificationStep"; 

import "../styles/Login.styles.css";

export default function LoginForm() {
    const { login } = useAuth();
    const { setUserPermission } = useAuth();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        email: "",
        senha: ""
    });

    // Estados para controle de feedback, visibilidade e fluxo
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // Estado para a mensagem de sucesso
    const [loading, setLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null); // Limpa mensagens de sucesso anteriores ao tentar logar

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

            setUserPermission(response.data.permissao)
            login(response.data.token);

            navigate("/");
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "Erro ao fazer login";
            
            const isNotVerified = typeof errorMessage === "string" && 
                errorMessage.toLowerCase().includes("não verificado");

            if (isNotVerified) {
                setNeedsVerification(true);
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    // Função que será disparada quando o VerificationStep der sucesso
    function handleVerificationSuccess() {
        setNeedsVerification(false);
        setSuccess("Email verificado. Faça login novamente.");
    }

    return (
        <div className="login-screen-container">
            <div className="login-card-box">
                
                <div className="card-column-left">
                    {!needsVerification ? (
                        <>
                            <h1>Login</h1>
                            
                            <form onSubmit={handleSubmit} className="formulario-login">
                                <div>
                                    <p>Email</p>
                                    <div className="input-wrapper">
                                        <Mail className="input-icon" size={18} />
                                        <input
                                            type="email"
                                            value={form.email}
                                            placeholder="seu@email.com"
                                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p>Senha</p>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={form.senha}
                                            placeholder="Sua senha"
                                            onChange={(e) => setForm(prev => ({ ...prev, senha: e.target.value }))}
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Exibe a mensagem de erro se houver */}
                                {error && <p className="error">{error}</p>}
                                
                                {/* Exibe a mensagem de sucesso se houver */}
                                {success && <p className="success-message" style={{ color: 'green', margin: '10px 0' }}>{success}</p>}

                                <button type="submit" disabled={loading}>
                                    {loading ? "Entrando..." : "Entrar"}
                                </button>
                            </form>
                            <Link to="/register" className="link">Não tem conta? Clique aqui!</Link>
                            <Link to="/forgot-password" className="link">Esqueceu a senha? Clique aqui!</Link>
                        </>
                    ) : (
                        // Passamos a nossa função para o componente de verificação
                        <VerificationStep 
                            email={form.email} 
                            onSuccess={handleVerificationSuccess} 
                        />
                    )}
                </div>
                
                <div className="card-column-right">
                    <div className="giant-icon">
                        {needsVerification ? (
                            <UserPlus size={100} strokeWidth={1.5} />
                        ) : (
                            <Package size={100} strokeWidth={1.5} />
                        )}
                    </div>
                    <h2>
                        {needsVerification 
                            ? "Verifique seu email" 
                            : "Seu pedido, nossa prioridade."}
                    </h2>
                    <p>
                        {needsVerification 
                            ? "Digite o código enviado para seu email para ativar sua conta." 
                            : "Entregamos com rapidez, cuidado e confiança"}
                    </p>
                </div>
                
            </div>
        </div>
    );
}