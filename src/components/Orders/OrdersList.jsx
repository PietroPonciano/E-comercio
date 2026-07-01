import { useNavigate } from "react-router-dom";
import { ExternalLink, PackageX } from "lucide-react";
import { useMyOrders } from "../../hooks/useOrders";
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

export default function OrdersList() {
    const { data, isLoading, error } = useMyOrders();
    const navigate = useNavigate();

    const texto = "as suas compras";

    if (isLoading) {
        return (
            <div className="orders-page">
                <div className="orders-loading">Carregando compras...</div>
            </div>
        );
    }

    if (error) return <ErroPersonalizado value={texto} />;

    const orders = data?.data ?? [];

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="orders-empty">
                    <PackageX size={40} />
                    <p>Você ainda não realizou nenhuma compra.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <h1 className="orders-title">Minhas Compras</h1>

            <div className="orders-container">
                <div className="orders-header">
                    <div>Pedido</div>
                    <div>Data</div>
                    <div>Status</div>
                    <div>Total</div>
                    <div className="text-right">Ações</div>
                </div>

                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-row">
                            <div className="order-id">#{order.id}</div>
                            <div className="order-date">{formatDate(order.createdAt)}</div>
                            <div className="order-status">
                                <span className={`order-badge ${getStatusClass(order.status)}`}>
                                    {order.status ?? "—"}
                                </span>
                            </div>
                            <div className="order-total">
                                {formatCurrency(order.preco_total)}
                            </div>
                            <div className="order-actions">
                                <button
                                    type="button"
                                    className="order-action-btn"
                                    onClick={() => navigate(`/my-orders/${order.id}`)}
                                    title="Ver detalhes da compra"
                                >
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
