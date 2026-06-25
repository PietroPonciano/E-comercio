import { MessageCirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { createTicketRequest } from "../services/createTicket.service";

export default function CreateTicketCTA() {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleCreateTicket(e) {
        e.preventDefault();
        
        if (!title.trim()) return;

        try {
            setLoading(true);
            setError(null);

            const data = await createTicketRequest(title);

            setTitle(""); // Limpa o input após criar com sucesso

            // navigate(`/tickets/${data.id}`);
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao criar o ticket. Tente novamente.");
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
                    <input
                        type="text"
                        placeholder="Digite o título do problema"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading} // Evita que o usuário edite enquanto carrega
                    />

                    {error && <p className="error-message">{error}</p>}

                    {/* O botão fica desabilitado se estiver carregando ou se o input estiver vazio */}
                    <button type="submit" disabled={loading || !title.trim()}>
                        {loading ? "Enviando..." : "Criar Ticket"}
                    </button>
                </form>
            </div>
        </section>
    );
}