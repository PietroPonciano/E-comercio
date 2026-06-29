import "../styles/ProfileSidebar.styles.css";
import { User, Mail, Phone, IdCard, MapPin } from "lucide-react";

const sections = [
    {
        id: "perfil",
        title: "Perfil",
        icon: User,
        items: [
            { id: "nome", label: "Nome", icon: User },
            { id: "sobrenome", label: "Sobrenome", icon: User },
            { id: "email", label: "Email", icon: Mail },
            { id: "telefone", label: "Telefone", icon: Phone },
            { id: "cpf", label: "CPF", icon: IdCard },
        ],
    },
    {
        id: "endereco",
        title: "Endereço",
        icon: MapPin,
        items: [
            { id: "endereco-info", label: "Endereço", icon: MapPin },
        ],
    },
];

export default function ProfileSidebar({ activeSection }) {
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <aside className="profile-sidebar">
            {sections.map((section) => {
                const SectionIcon = section.icon;
                
                
                const isSectionActive = 
                    activeSection === section.id || 
                    section.items.some(item => item.id === activeSection);

                return (
                    <div className="sidebar-group" key={section.id}>
                        <button
                            className={`sidebar-title ${isSectionActive ? "active" : ""}`}
                            onClick={() => scrollToSection(section.id)}
                            style={{ display: "flex", alignItems: "center", gap: "8px" }}
                        >
                            <SectionIcon size={16} strokeWidth={2.5} />
                            {section.title}
                        </button>

                        <div className="sidebar-items">
                            {section.items.map((item) => {
                                const ItemIcon = item.icon;
                                
                                
                                const isItemActive = activeSection === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        className={`sidebar-item ${isItemActive ? "active" : ""}`}
                                        onClick={() => scrollToSection(item.id)}
                                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                    >
                                        <ItemIcon size={14} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </aside>
    );
}