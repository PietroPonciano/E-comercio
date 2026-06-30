import { useState } from "react";
import { Plus, LoaderCircle } from "lucide-react";
import { useProducts } from "../../hooks/Products/useProducts";
import ErroPersonalizado from "../ErroPersonalizado";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";
import DeleteProductModal from "./DeleteProductModal";
import "./Product.styles.css";

export default function ProductSection() {
    const { data: products = [], isLoading, isError } = useProducts();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [mode, setMode] = useState("create");

    function openCreateModal() {
        setMode("create");
        setSelectedProduct(null);
        setIsProductModalOpen(true);
    }

    function openEditModal(product) {
        setMode("edit");
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    }

    function openDeleteModal(product) {
        setSelectedProduct(product);
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
        return <ErroPersonalizado value="os produtos" />;
    }

    return (
        <section className="product-section">
            <div className="product-section-header">
                <h2>Produtos</h2>
                <button type="button" className="product-new-btn" onClick={openCreateModal}>
                    <Plus size={18} />
                    Novo produto
                </button>
            </div>

            <ProductList
                products={products}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
            />

            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                mode={mode}
                product={selectedProduct}
            />

            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                product={selectedProduct}
            />
        </section>
    );
}
