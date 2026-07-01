import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ImageOff, LoaderCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../context/CartContext";
import ErroPersonalizado from "../components/ErroPersonalizado";
import "../styles/ProductDetail.styles.css";

export default function ProductDetail() {
    const { id } = useParams();
    const { data, isLoading, error } = useProduct(id);
    const { addItem } = useCart();
    const [quantidade, setQuantidade] = useState(1);

    const texto = "os detalhes do produto";

    if (isLoading) {
        return (
            <section className="product-detail-page">
                <div className="product-detail-loading">
                    <LoaderCircle className="product-detail-spinner" size={36} />
                    <p>Carregando produto...</p>
                </div>
            </section>
        );
    }

    if (error) return <ErroPersonalizado value={texto} />;

    const product = data?.data;

    if (!product) {
        return (
            <section className="product-detail-page">
                <div className="product-detail-empty">
                    <p>Produto não encontrado.</p>
                    <Link to="/" className="product-detail-back-link">
                        <ArrowLeft size={18} />
                        Voltar aos produtos
                    </Link>
                </div>
            </section>
        );
    }

    const handleAddToCart = () => {
        addItem(product, quantidade);
    };

    return (
        <section className="product-detail-page">
            <div className="product-detail-container">
                <Link to="/" className="product-detail-back-link">
                    <ArrowLeft size={18} />
                    Voltar aos produtos
                </Link>

                <div className="product-detail-grid">
                    <div className="product-detail-image">
                        {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} />
                        ) : (
                            <ImageOff size={64} color="#999" />
                        )}
                    </div>

                    <div className="product-detail-info">
                        <h1>{product.nome}</h1>

                        {product.categoria?.nome && (
                            <span className="product-detail-category">
                                {product.categoria.nome}
                            </span>
                        )}

                        <p className="product-detail-price">
                            R$ {Number(product.preco).toFixed(2)}
                        </p>

                        <p className="product-detail-description">{product.descricao}</p>

                        <div className="product-detail-actions">
                            <div className="product-detail-quantity">
                                <label htmlFor="quantidade">Quantidade</label>
                                <input
                                    id="quantidade"
                                    type="number"
                                    min={1}
                                    value={quantidade}
                                    onChange={(event) =>
                                        setQuantidade(Math.max(1, Number(event.target.value) || 1))
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                className="product-detail-add-btn"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart size={18} />
                                Adicionar ao carrinho
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
