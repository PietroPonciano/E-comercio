import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.styles.css";

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();

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
                                Home
                            </NavLink>
                            
                            <NavLink className="nav-link" to="/about">
                                About
                            </NavLink>
                            
                            <NavLink className="nav-link" to="/profile">
                                Profile
                            </NavLink>

                            {isLoggedIn ? (
                                <button className="nav-link btn-logout" onClick={logout}>
                                    Logout
                                </button>
                            ) : (
                                <div className="auth-links">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                    {/* Esconde a barra em telas pequenas (mobile) */}
                                    <span className="separator d-none d-lg-block">/</span>
                                    <NavLink className="nav-link" to="/register">Register</NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </nav>
        </header>
    );
}