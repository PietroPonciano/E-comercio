import { Link } from "react-router-dom";
import { ImageOff, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import "../styles/Checkout.styles.css";

export default function Carrinho() {
    const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

    if (items.length === 0) {
        return (
            <section className="checkout-page">
                <div className="checkout-empty">
                    <ShoppingBag size={48} />
                    <h1>Seu carrinho está vazio</h1>
                    <p>Adicione produtos na página inicial para continuar.</p>
                    <Link to="/" className="checkout-btn checkout-btn--primary">
                        Ver produtos
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="checkout-page">
            <div className="checkout-container">
                <h1>Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})</h1>

                <div className="checkout-grid">
                    <div className="checkout-items">
                        {items.map((item) => (
                            <article key={item.produto_id} className="checkout-item">
                                <div className="checkout-item-image">
                                    {item.imagem_url ? (
                                        <img src={item.imagem_url} alt={item.nome} />
                                    ) : (
                                        <ImageOff size={32} color="#999" />
                                    )}
                                </div>

                                <div className="checkout-item-info">
                                    <h3>{item.nome}</h3>
                                    <p>R$ {Number(item.preco).toFixed(2)}</p>
                                </div>

                                <div className="checkout-item-quantity">
                                    <button
                                        type="button"
                                        aria-label="Diminuir quantidade"
                                        onClick={() =>
                                            updateQuantity(item.produto_id, item.quantidade - 1)
                                        }
                                        disabled={item.quantidade <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span>{item.quantidade}</span>
                                    <button
                                        type="button"
                                        aria-label="Aumentar quantidade"
                                        onClick={() =>
                                            updateQuantity(item.produto_id, item.quantidade + 1)
                                        }
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <p className="checkout-item-total">
                                    R$ {(item.preco * item.quantidade).toFixed(2)}
                                </p>

                                <button
                                    type="button"
                                    className="checkout-item-remove"
                                    aria-label="Remover item"
                                    onClick={() => removeItem(item.produto_id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </article>
                        ))}
                    </div>

                    <aside className="checkout-summary">
                        <h2>Resumo</h2>
                        <div className="checkout-summary-row">
                            <span>Subtotal</span>
                            <strong>R$ {subtotal.toFixed(2)}</strong>
                        </div>
                        <p className="checkout-summary-note">
                            Frete e impostos serão calculados na próxima etapa.
                        </p>
                        <Link to="/checkout" className="checkout-btn checkout-btn--primary checkout-btn--full">
                            Ir para checkout
                        </Link>
                    </aside>
                </div>
            </div>
        </section>
    );
}
