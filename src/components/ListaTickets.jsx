import { useMyTickets } from "../hooks/useTickets";
import { useNavigate } from "react-router-dom";

export default function MyTicketsList() {
    const { data, isLoading, error } = useMyTickets();
    const navigate = useNavigate();


    if (isLoading) {
        return <p>Carregando tickets...</p>;
    }

    if (error) {
        return <p>Erro ao carregar tickets.</p>;
    }

    const tickets = data?.data ?? [];

    if (tickets.length === 0) {
        return (
            <p>
                Você não possui tickets ativos.
            </p>
        );
    }

    return (
        <div className="tickets-list">
            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className="ticket-card"
                >
                    <h3>{ticket.titulo}</h3>

                    <p>
                        ID:
                        <strong>
                            {" "}
                            {ticket.id}
                        </strong>
                    </p>
                    <p>
                        Status:
                        <strong>
                            {" "}
                            {ticket.status}
                        </strong>
                    </p>

                    <p>
                        Criado por:
                        {" "}
                        {ticket.cliente.nome}
                    </p>
                    <p>
                        Assumido por:{" "}
                        {ticket.atendente?.nome ?? "Ninguém"}
                    </p>

                    <p>
                        Criado em:
                        {" "}
                        {new Date(
                            ticket.createdAt
                        ).toLocaleDateString(
                            "pt-BR"
                        )}
                    </p>
                    <p>
                        {!["aberto", "em_atendimento"].includes(ticket.status) &&
                            ticket.data_finalizacao && (
                                <>
                                    Finalizado em:
                                    <p>
                                        {" "}
                                        {new Date(
                                            ticket.data_finalizacao
                                        ).toLocaleDateString(
                                            "pt-BR"
                                        )}
                                    </p>
                                </>
                            )}
                    </p>
                    <button onClick={() => navigate(`/tickets/${ticket.id}`)}>
                        Abrir ticket
                    </button>
                </div>
            ))}
        </div>
    );
}