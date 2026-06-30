import { useState } from "react";
import { Plus, LoaderCircle } from "lucide-react";
import { useCategories } from "../../hooks/Categories/useCategories";
import ErroPersonalizado from "../ErroPersonalizado";
import CategoryList from "./CategoryList";
import CategoryModal from "./CategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import "./Category.styles.css";

export default function CategorySection() {
    const { data: categories = [], isLoading, isError } = useCategories();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [mode, setMode] = useState("create");

    function openCreateModal() {
        setMode("create");
        setSelectedCategory(null);
        setIsCategoryModalOpen(true);
    }

    function openEditModal(category) {
        setMode("edit");
        setSelectedCategory(category);
        setIsCategoryModalOpen(true);
    }

    function openDeleteModal(category) {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    }

    if (isLoading) {
        return (
            <div className="section-loading">
                <LoaderCircle className="section-spinner" size={32} />
            </div>
        );
    }

    if (isError) {
        return <ErroPersonalizado value="as categorias" />;
    }

    return (
        <section className="category-section">
            <div className="category-section-header">
                <h2>Categorias</h2>
                <button type="button" className="category-new-btn" onClick={openCreateModal}>
                    <Plus size={18} />
                    Nova categoria
                </button>
            </div>

            <CategoryList
                categories={categories}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
            />

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                mode={mode}
                category={selectedCategory}
            />

            <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                category={selectedCategory}
            />
        </section>
    );
}
