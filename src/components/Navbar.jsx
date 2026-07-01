import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import "./Navbar.styles.css";

export default function Navbar() {
    const { isLoggedIn, logout, Atendente, Adm } = useAuth();
    const { permission } = useAuth();
    const { totalItems } = useCart();


    return (
        <header>

            <nav className="navbar navbar-expand-lg elementos-nav">
                <div className="container-fluid">


                    <Link to="/" className="navbar-brand elemento-logo">
                        <ShoppingCart className="logo" size={30} />
                        <h2>E-comercio</h2>
                    </Link>


                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>


                    <div className="collapse navbar-collapse" id="navbarNav">

                        <div className="navbar-nav ms-auto nav-links-container">
                            <NavLink className="nav-link" to="/">
                                Início
                            </NavLink>

                            <NavLink className="nav-link" to="/contact">
                                Contato
                            </NavLink>

                            <NavLink className="nav-link navbar-cart-link" to="/carrinho">
                                <ShoppingCart size={18} />
                                Carrinho
                                {totalItems > 0 && (
                                    <span className="navbar-cart-badge">{totalItems}</span>
                                )}
                            </NavLink>
                            {(permission === Adm || permission === Atendente) && (
                                <>
                                    <NavLink className="nav-link" to="/tickets">
                                        Atendimentos
                                    </NavLink>
                                </>
                            )}

                            {permission === Adm && (
                                <>
                                    <NavLink className="nav-link" to="/painel">
                                        Painel 
                                    </NavLink>
                                </>
                            )}

                            {isLoggedIn ? (
                                <>
                                    <NavLink className="nav-link" to="/my-tickets">
                                        Meus Atendimentos
                                    </NavLink>
                                    <NavLink className="nav-link" to="/my-orders">
                                        Minhas Compras
                                    </NavLink>
                                    <NavLink className="nav-link" to="/profile">
                                        Perfil
                                    </NavLink>

                                    <button className="nav-link btn-logout" onClick={logout}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="auth-links">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                    <span className="separator d-none d-lg-block">/</span>
                                    <NavLink className="nav-link" to="/register">Criar Conta</NavLink>
                                </div>
                            )}


                        </div>
                    </div>

                </div>
            </nav>
        </header>
    );
}