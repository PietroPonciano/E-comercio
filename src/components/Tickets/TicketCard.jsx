import "./TicketCard.styles.css";
import { Trash2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssumeTicket } from "../../hooks/useAssumeTicket";
import { useDeleteTicket } from "../../hooks/useDeleteTicket";
import { useUpdateTicketStatus } from "../../hooks/useUpdateTicketStatus";

export default function TicketCard({ ticket }) {
    const assumeTicketMutation = useAssumeTicket();
    const updateStatusMutation = useUpdateTicketStatus();
    const deleteTicketMutation = useDeleteTicket();
    const navigate = useNavigate();


    function handleOpenTicket() {
        navigate(`/tickets/${ticket.id}`);
    }

    function handleStatusChange(e) {
        updateStatusMutation.mutate({
            id: ticket.id,
            status: e.target.value,
        });
    }

    function handleAssumeTicket() {
        assumeTicketMutation.mutate(ticket.id);
    }

    function handleDeleteTicket() {
        const confirmDelete = window.confirm(
            "Deseja realmente excluir este ticket?"
        );

        if (!confirmDelete) return;

        deleteTicketMutation.mutate(ticket.id);
    }

    return (
        <article className="ticket-card" onClick={handleOpenTicket}>
            <div className="ticket-card-header">
                <div>
                    <h3>{ticket.titulo}</h3>
                    <span>#{ticket.id}</span>
                </div>

                <select
                    value={ticket.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleStatusChange}
                    disabled={updateStatusMutation.isPending}
                >
                    <option value="aberto">
                        Aberto
                    </option>

                    <option value="em_atendimento">
                        Em atendimento
                    </option>

                    <option value="finalizado">
                        Finalizado
                    </option>
                </select>
            </div>

            <div className="ticket-card-body">
                <p>
                    <strong>Cliente:</strong>{" "}
                    {ticket.cliente.nome}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {ticket.cliente.email}
                </p>

                <p>
                    <strong>Mensagens:</strong>{" "}
                    {ticket.quantidade_mensagens}
                </p>

                <p>
                    <strong>Atendente:</strong>{" "}
                    {ticket.atendente?.nome ?? "Não atribuído"}
                </p>
            </div>

            <div className="ticket-card-actions">
                {!ticket.atendente && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAssumeTicket();
                        }}
                        disabled={assumeTicketMutation.isPending}
                    >
                        <UserPlus size={18} />
                        Assumir
                    </button>
                )}

                <button
                    className="danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTicket();
                    }}
                    disabled={deleteTicketMutation.isPending}
                >
                    <Trash2 size={18} />
                    Excluir
                </button>
            </div>
        </article>
    );
}