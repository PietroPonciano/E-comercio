import { Pencil, Trash2, Tags } from "lucide-react";
import "./Category.styles.css";

export default function CategoryCard({ category, onEdit, onDelete }) {
    return (
        <article className="category-card">
            <div className="category-card-icon">
                <Tags size={24} />
            </div>

            <div className="category-card-info">
                <h3>{category.nome}</h3>
                <p>{category.descricao}</p>
            </div>

            <div className="category-card-actions">
                <button type="button" className="category-action-btn" onClick={() => onEdit(category)}>
                    <Pencil size={16} />
                    Editar
                </button>
                <button
                    type="button"
                    className="category-action-btn category-action-delete"
                    onClick={() => onDelete(category)}
                >
                    <Trash2 size={16} />
                    Excluir
                </button>
            </div>
        </article>
    );
}
