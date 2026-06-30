import { User, Mail, Phone, IdCard, Pencil } from "lucide-react";
import "./User.styles.css";

export default function UserCard({ user, onEdit, isFetching }) {
    return (
        <div className="user-card">
            <div className="user-card-header">
                <h2>
                    <User size={24} strokeWidth={2.5} />
                    Usuário #{user?.id}
                    {isFetching && " ..."}
                </h2>

                <button type="button" className="user-card-edit" onClick={onEdit}>
                    <Pencil size={16} />
                    Editar
                </button>
            </div>

            <div className="user-card-fields">
                <div className="user-field">
                    <label><User size={13} /> Nome</label>
                    <p>{user?.nome}</p>
                </div>

                <div className="user-field">
                    <label><User size={13} /> Sobrenome</label>
                    <p>{user?.sobrenome}</p>
                </div>

                <div className="user-field">
                    <label><Mail size={13} /> Email</label>
                    <p>{user?.email}</p>
                </div>

                <div className="user-field">
                    <label><Phone size={13} /> Telefone</label>
                    <p>{user?.telefone || "—"}</p>
                </div>

                <div className="user-field">
                    <label><IdCard size={13} /> CPF</label>
                    <p>{user?.cpf}</p>
                </div>
            </div>
        </div>
    );
}
