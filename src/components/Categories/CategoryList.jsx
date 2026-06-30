import { Tags } from "lucide-react";
import CategoryCard from "./CategoryCard";
import "./Category.styles.css";

export default function CategoryList({ categories, onEdit, onDelete }) {
    if (categories.length === 0) {
        return (
            <div className="category-empty">
                <Tags size={48} />
                <p>Nenhuma categoria cadastrada.</p>
            </div>
        );
    }

    return (
        <div className="category-list">
            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
