import { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, MapPin, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../hooks/useCheckout";
import { getFormasEntrega } from "../../services/checkout.service";
import "../../styles/Checkout.styles.css";

const FORMAS_ENTREGA_FALLBACK = [
    { id: 1, nome: "Entrega padrão" },
    { id: 2, nome: "Entrega expressa" },
];

export default function Checkout() {
    const { items, subtotal, toCheckoutPayload } = useCart();
    const checkout = useCheckout();

    const [formaEntregaId, setFormaEntregaId] = useState("1");
    const [enderecoEntrega, setEnderecoEntrega] = useState("");

    const { data: formasEntregaData } = useQuery({
        queryKey: ["formas-entrega"],
        queryFn: getFormasEntrega,
        retry: false,
    });

    const formasEntrega = formasEntregaData?.data ?? FORMAS_ENTREGA_FALLBACK;

    const handleSubmit = (event) => {
        event.preventDefault();

        checkout.mutate({
            itens: toCheckoutPayload(),
            forma_entrega_id: Number(formaEntregaId),
            ...(enderecoEntrega.trim() && { endereco_entrega: enderecoEntrega.trim() }),
        });
    };

    if (items.length === 0) {
        return (
            <section className="checkout-page">
                <div className="checkout-empty">
                    <h1>Nenhum item para checkout</h1>
                    <p>Adicione produtos ao carrinho antes de finalizar a compra.</p>
                    <Link to="/" className="checkout-btn checkout-btn--primary">
                        Ver produtos
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="checkout-page">
            <div className="checkout-container checkout-container--narrow">
                <h1>Finalizar compra</h1>

                <form className="checkout-form" onSubmit={handleSubmit}>
                    <fieldset className="checkout-fieldset">
                        <legend>
                            <Truck size={18} />
                            Forma de entrega
                        </legend>

                        <select
                            value={formaEntregaId}
                            onChange={(event) => setFormaEntregaId(event.target.value)}
                            required
                        >
                            {formasEntrega.map((forma) => (
                                <option key={forma.id} value={forma.id}>
                                    {forma.nome}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <fieldset className="checkout-fieldset">
                        <legend>
                            <MapPin size={18} />
                            Endereço de entrega (opcional)
                        </legend>

                        <textarea
                            value={enderecoEntrega}
                            onChange={(event) => setEnderecoEntrega(event.target.value)}
                            placeholder="Rua, número, bairro, cidade..."
                            rows={3}
                        />
                    </fieldset>

                    <div className="checkout-summary checkout-summary--inline">
                        <h2>Resumo do pedido</h2>
                        <ul className="checkout-summary-list">
                            {items.map((item) => (
                                <li key={item.produto_id}>
                                    <span>
                                        {item.quantidade}x {item.nome}
                                    </span>
                                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="checkout-summary-row">
                            <span>Subtotal</span>
                            <strong>R$ {subtotal.toFixed(2)}</strong>
                        </div>
                    </div>

                    {checkout.isError && (
                        <p className="checkout-error">
                            {checkout.error?.response?.data?.message ||
                                checkout.error?.message ||
                                "Não foi possível iniciar o checkout. Tente novamente."}
                        </p>
                    )}

                    <div className="checkout-form-actions">
                        <Link to="/carrinho" className="checkout-btn checkout-btn--secondary">
                            Voltar ao carrinho
                        </Link>
                        <button
                            type="submit"
                            className="checkout-btn checkout-btn--primary"
                            disabled={checkout.isPending}
                        >
                            {checkout.isPending ? (
                                <>
                                    <LoaderCircle className="checkout-spinner" size={18} />
                                    Redirecionando...
                                </>
                            ) : (
                                "Pagar com Mercado Pago"
                            )}
                        </button>
                    </div>

                    <p className="checkout-security-note">
                        Você será redirecionado ao Mercado Pago. A confirmação do pagamento é
                        feita pelo backend via webhook — não pelo retorno desta página.
                    </p>
                </form>
            </div>
        </section>
    );
}
