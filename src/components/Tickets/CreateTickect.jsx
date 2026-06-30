import { MessageCirclePlus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { createTicketRequest } from "../../services/createTicket.service";



export default function CreateTicketCTA() {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState(null);

    const { isLoggedIn } = useAuth();

    const navigate = useNavigate();

    

    async function handleCreateTicket(e) {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            setLoading(true);

            await createTicketRequest(title);

            queryClient.invalidateQueries({
                queryKey: ["my-tickets"]
            });

            setSuccess("Ticket criado com sucesso!");
            setTitle("");


        } catch (err) {
            setError("Erro ao criar ticket.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="ticket-cta">
            <div className="ticket-cta-content">
                <MessageCirclePlus size={48} />

                <h2>Ainda precisa de ajuda?</h2>
                <p>
                    Nossa equipe está pronta para ajudar. Descreva o problema abaixo e
                    responderemos o mais rápido possível.
                </p>

                <form onSubmit={handleCreateTicket} className="ticket-form">
                    {isLoggedIn ? (
                        <>
                            <input
                                type="text"
                                placeholder="Digite o título do problema"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />

                            {error && <p className="error-message">{error}</p>}

                            {success && (
                                <p className="success-message">
                                    {success}. <Link to="/tickets">Acesse seu atendimento aqui!</Link>
                                </p>
                            )}

                            <button type="submit" disabled={loading || !title.trim()}>
                                {loading ? "Enviando..." : "Criar Atendimento"}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="link-login">
                                Faça login para poder iniciar um atendimento.
                            </Link>
                        </>
                    )}

                </form>
            </div>
        </section>
    );
}