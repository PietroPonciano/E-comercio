import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ImageOff, LoaderCircle, MapPin, Truck } from "lucide-react";
import { useMyOrder } from "../../hooks/useOrders";
import ErroPersonalizado from "../ErroPersonalizado";
import "./Orders.styles.css";

const STATUS_CLASSES = {
    pendente: "order-badge--pending",
    pago: "order-badge--paid",
    aprovado: "order-badge--paid",
    cancelado: "order-badge--cancelled",
    rejeitado: "order-badge--cancelled",
    em_processamento: "order-badge--processing",
};

function getStatusClass(status) {
    return STATUS_CLASSES[status?.toLowerCase()] ?? "order-badge--default";
}

function formatCurrency(value) {
    return `R$ ${Number(value ?? 0).toFixed(2)}`;
}

function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function OrderDetail() {
    const { id } = useParams();
    const { data, isLoading, error } = useMyOrder(id);

    const texto = "os detalhes da compra";

    if (isLoading) {
        return (
            <div className="orders-page">
                <div className="orders-loading">
                    <LoaderCircle className="orders-spinner" size={32} />
                    <p>Carregando pedido...</p>
                </div>
            </div>
        );
    }

    if (error) return <ErroPersonalizado value={texto} />;

    const order = data?.data;

    if (!order) {
        return (
            <div className="orders-page">
                <div className="orders-empty">
                    <p>Pedido não encontrado.</p>
                    <Link to="/my-orders" className="orders-back-link">
                        <ArrowLeft size={18} />
                        Voltar às compras
                    </Link>
                </div>
            </div>
        );
    }

    const itens = order.itens ?? order.items ?? [];

    return (
        <div className="orders-page">
            <div className="order-detail-container">
                <Link to="/my-orders" className="orders-back-link">
                    <ArrowLeft size={18} />
                    Voltar às compras
                </Link>

                <div className="order-detail-header">
                    <div>
                        <h1>Pedido #{order.id}</h1>
                        <p className="order-detail-date">
                            Realizado em {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <span className={`order-badge ${getStatusClass(order.status)}`}>
                        {order.status ?? "—"}
                    </span>
                </div>

                <div className="order-detail-grid">
                    <section className="order-detail-card">
                        <h2>Itens do pedido</h2>
                        <ul className="order-items-list">
                            {itens.length === 0 ? (
                                <li className="order-item-empty">Nenhum item registrado.</li>
                            ) : (
                                itens.map((item) => {
                                    const produto = item.produto ?? item.product ?? {};
                                    const nome = item.nome ?? produto.nome ?? "Produto";
                                    const imagem = item.imagem_url ?? produto.imagem_url;
                                    const preco = order.preco_total ?? 0;
                                    const quantidade = item.quantidade ?? 1;

                                    return (
                                        <li key={item.id ?? `${item.produto_id}-${nome}`} className="order-item">
                                            <div className="order-item-image">
                                                {imagem ? (
                                                    <img src={imagem} alt={nome} />
                                                ) : (
                                                    <ImageOff size={24} color="#999" />
                                                )}
                                            </div>
                                            <div className="order-item-info">
                                                <strong>{nome}</strong>
                                                <span>
                                                    {quantidade}x {formatCurrency(preco)}
                                                </span>
                                            </div>
                                            <div className="order-item-total">
                                                {formatCurrency(preco * quantidade)}
                                            </div>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </section>

                    <aside className="order-detail-sidebar">
                        <section className="order-detail-card">
                            <h2>Resumo</h2>
                            <div className="order-summary-row">
                                <span>Subtotal</span>
                                <strong>
                                    {formatCurrency(order.preco_total )}
                                </strong>
                            </div>
                            {order.forma_entrega?.nome && (
                                <div className="order-summary-info">
                                    <Truck size={16} />
                                    <span>{order.forma_entrega.nome}</span>
                                </div>
                            )}
                            {order.endereco_entrega && (
                                <div className="order-summary-info">
                                    <MapPin size={16} />
                                    <span>{order.endereco_entrega}</span>
                                </div>
                            )}
                        </section>

                        {(order.payment_id || order.mercadopago_payment_id) && (
                            <section className="order-detail-card">
                                <h2>Pagamento</h2>
                                <p className="order-payment-id">
                                    ID: {order.payment_id ?? order.mercadopago_payment_id}
                                </p>
                            </section>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
