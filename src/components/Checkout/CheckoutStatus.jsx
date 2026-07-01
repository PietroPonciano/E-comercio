import { Link } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import "../../styles/Checkout.styles.css";

const STATUS_CONFIG = {
    success: {
        icon: CheckCircle2,
        title: "Pagamento em análise",
        message:
            "Recebemos seu retorno do Mercado Pago. A confirmação final do pagamento será feita pelo nosso sistema em instantes.",
        note: "Não considere esta tela como confirmação definitiva. Você será notificado quando o pedido for validado.",
        className: "checkout-status--success",
    },
    failure: {
        icon: XCircle,
        title: "Pagamento não concluído",
        message:
            "O pagamento não foi finalizado no Mercado Pago. Você pode tentar novamente quando quiser.",
        note: "Se acredita que houve um erro, verifique seu extrato ou entre em contato conosco.",
        className: "checkout-status--failure",
    },
    pending: {
        icon: Clock,
        title: "Pagamento pendente",
        message:
            "Seu pagamento está aguardando confirmação (ex.: boleto ou transferência). Assim que for compensado, atualizaremos seu pedido.",
        note: "Esta página é apenas informativa. O status real será confirmado pelo backend via webhook.",
        className: "checkout-status--pending",
    },
};

export default function CheckoutStatus({ status }) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <section className={`checkout-status ${config.className}`}>
            <div className="checkout-status-card">
                <Icon className="checkout-status-icon" size={56} />

                <h1>{config.title}</h1>
                <p className="checkout-status-message">{config.message}</p>
                <p className="checkout-status-note">{config.note}</p>

                <div className="checkout-status-actions">
                    <Link to="/" className="checkout-btn checkout-btn--primary">
                        Voltar à loja
                    </Link>
                    <Link to="/contact" className="checkout-btn checkout-btn--secondary">
                        Falar com suporte
                    </Link>
                </div>
            </div>
        </section>
    );
}
