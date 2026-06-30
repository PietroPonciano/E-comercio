import { PackageX } from "lucide-react";
import ProductCard from "./ProductCard";
import "./Product.styles.css";

export default function ProductList({ products, onEdit, onDelete }) {
    if (products.length === 0) {
        return (
            <div className="product-empty">
                <PackageX size={48} />
                <p>Nenhum produto cadastrado.</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
