import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import "./Footer.styles.css";

export default function Footer() {
    const { isLoggedIn, logout, Atendente, Adm, permission } = useAuth();

    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-logo">
                    <ShoppingCart size={40} />
                    <h2>E-commerce</h2>
                </div>

                <div className="footer-links">

                    <div className="footer-column">
                        <h4>Navegação</h4>

                        <Link to="/">Início</Link>
                        <Link to="/contact">Contato</Link>

                        {isLoggedIn ? (
                            <Link to="/profile">Perfil</Link>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Cadastro</Link>
                            </>
                        )}

                        {permission === Atendente && <>
                            <Link to="/tickets">Atendimento</Link>
                        </>}

                        
                        {permission === Adm && <>
                            <Link to="/painel">Painel</Link>
                        </>}
                    </div>

                    <div className="footer-column">
                        <h4>Conta</h4>

                        {isLoggedIn ? (
                            <>
                                <Link to="/profile">Minha Conta</Link>
                                <Link to="/forgot-password">
                                    Alterar Senha
                                </Link>
                                <Link onClick={logout}>
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Entrar</Link>
                                <Link to="/register">Criar Conta</Link>
                                <Link to="/forgot-password">
                                    Recuperar Senha
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="footer-column">
                        <h4>Suporte</h4>

                        <Link to="/contact">Fale Conosco</Link>
                        <Link to="/forgot-password">
                            Recuperação de Senha
                        </Link>
                    </div>

                    {isLoggedIn && (
                        <div className="footer-column">
                            <h4>Painel</h4>

                            <Link to="/tickets">
                                Gerenciar Produtos
                            </Link>

                            <Link to="/profile">
                                Meu Perfil
                            </Link>
                        </div>
                    )}

                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} E-commerce. Todos os direitos
                    reservados.
                </p>
            </div>
        </footer>
    );
}