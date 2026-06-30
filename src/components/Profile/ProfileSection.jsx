import "./ProfileSection.styles.css";
import { User, Mail, Phone, IdCard } from "lucide-react";

export default function ProfileSection({ profile }) {
    return (
        <section id="perfil" className="profile-section">
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <User size={24} strokeWidth={2.5} />
                Perfil
            </h2>

            <div className="profile-card">
                <div className="profile-field" id="nome">
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={13} /> Nome
                    </label>
                    <p>{profile?.nome}</p>
                </div>

                <div className="profile-field" id="sobrenome">
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={13} /> Sobrenome
                    </label>
                    <p>{profile?.sobrenome}</p>
                </div>

                <div className="profile-field" id="email">
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Mail size={13} /> Email
                    </label>
                    <p>{profile?.email}</p>
                </div>

                <div className="profile-field" id="telefone">
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Phone size={13} /> Telefone
                    </label>
                    <p>{profile?.telefone}</p>
                </div>

                <div className="profile-field" id="cpf">
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <IdCard size={13} /> CPF
                    </label>
                    <p>{profile?.cpf}</p>
                </div>
            </div>
        </section>
    );
}