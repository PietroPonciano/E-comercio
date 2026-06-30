import { ImageOff, Pencil, Trash2 } from "lucide-react";
import "./Product.styles.css";

export default function ProductCard({ product, onEdit, onDelete }) {
    return (
        <article className="product-card">
            <div className="product-card-image">
                {product.imagem_url ? (
                    <img src={product.imagem_url} alt={product.nome} />
                ) : (
                    <ImageOff size={40} color="#999" />
                )}
            </div>

            <div className="product-card-info">
                <h3>{product.nome}</h3>
                <p className="product-card-desc">{product.descricao}</p>
                <p className="product-card-price">R$ {Number(product.preco).toFixed(2)}</p>
            </div>

            <div className="product-card-actions">
                <button type="button" className="product-action-btn" onClick={() => onEdit(product)}>
                    <Pencil size={16} />
                    Editar
                </button>
                <button
                    type="button"
                    className="product-action-btn product-action-delete"
                    onClick={() => onDelete(product)}
                >
                    <Trash2 size={16} />
                    Excluir
                </button>
            </div>
        </article>
    );
}
