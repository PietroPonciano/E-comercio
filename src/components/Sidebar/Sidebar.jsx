import { User, Package, Tags } from "lucide-react";
import "./Sidebar.styles.css";

const sections = [
    { id: "user", label: "Usuário", icon: User },
    { id: "products", label: "Produtos", icon: Package },
    { id: "categories", label: "Categorias", icon: Tags },
];

export default function Sidebar({ section, setSection }) {
    return (
        <aside className="dashboard-sidebar">
            <h2 className="dashboard-sidebar-title">Painel</h2>

            <nav className="dashboard-sidebar-nav">
                {sections.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        className={`dashboard-sidebar-item ${section === id ? "active" : ""}`}
                        onClick={() => setSection(id)}
                    >
                        <Icon size={18} strokeWidth={2.5} />
                        {label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}
