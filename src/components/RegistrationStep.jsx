import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, MapPin, Phone, CreditCard, Eye, EyeOff } from "lucide-react";
import { registerRequest } from "../services/auth/register";
import { registerSchema } from "../schemas/registerSchema";
import { cpfMask, phoneMask } from "../utils/mask";

export default function RegistrationStep({ onSuccess }) {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        nome: "",
        sobrenome: "",
        email: "",
        senha: "",
        endereco: "",
        cpf: "",
        telefone: ""
    });

    async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const result = registerSchema.safeParse(form);

    if (!result.success) {
        setError(result.error.issues[0]?.message);
        return;
    }

    try {
        setLoading(true);

        const payload = { ...result.data };

        if (!payload.telefone) {
            delete payload.telefone;
        }

        const response = await registerRequest(payload);

        if (response.success) {
            onSuccess(result.data.email);
        }

    } catch (err) {
        setError(err?.response?.data?.message || "Erro ao criar conta");
    } finally {
        setLoading(false);
    }
}

    return (
        <>
            <h1>Criar Conta</h1>

            <form onSubmit={handleSubmit} className="formulario-register">
                <div>
                    <p>Nome</p>
                    <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <input
                            type="text"
                            value={form.nome}
                            placeholder="Seu nome"
                            onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
                        />
                    </div>
                </div>

                <div>
                    <p>Sobrenome</p>
                    <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <input
                            type="text"
                            value={form.sobrenome}
                            placeholder="Seu sobrenome"
                            onChange={(e) => setForm(prev => ({ ...prev, sobrenome: e.target.value }))}
                        />
                    </div>
                </div>

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
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div>
                    <p>Endereço</p>
                    <div className="input-wrapper">
                        <MapPin className="input-icon" size={18} />
                        <input
                            type="text"
                            value={form.endereco}
                            placeholder="Seu endereço"
                            onChange={(e) => setForm(prev => ({ ...prev, endereco: e.target.value }))}
                        />
                    </div>
                </div>

                <div>
                    <p>CPF</p>
                    <div className="input-wrapper">
                        <CreditCard className="input-icon" size={18} />
                        <input
                            type="text"
                            value={form.cpf}
                            placeholder="000.000.000-00"
                            onChange={(e) => setForm(prev => ({ ...prev, cpf: cpfMask(e.target.value) }))}
                        />
                    </div>
                </div>

                <div>
                    <p>Telefone (Opcional)</p>
                    <div className="input-wrapper">
                        <Phone className="input-icon" size={18} />
                        <input
                            type="text"
                            value={form.telefone}
                            placeholder="+55 9 9999-9999"
                            onChange={(e) => setForm(prev => ({ ...prev, telefone: phoneMask(e.target.value) }))}
                        />
                    </div>
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar Conta"}
                </button>
            </form>

            <Link to="/login" className="link">
                Já possui conta? Faça login
            </Link>
        </>
    );
}