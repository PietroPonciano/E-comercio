import { useState } from "react";
import { useMyTickets } from "../hooks/useTickets";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff, ExternalLink } from "lucide-react"; 
import ListaTicketSkeleton from "./ListaTicketSkeleton";
import ErroPersonalizado from "./ErroPersonalizado";


export default function MyTicketsList() {
    const { data, isLoading, error } = useMyTickets();
    const navigate = useNavigate();
    const [expandedTickets, setExpandedTickets] = useState({});

    const toggleDetails = (id) => {
        setExpandedTickets((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const texto = "os seus atendimentos"

    if (isLoading) return <ListaTicketSkeleton /> ;
    if (error) return <ErroPersonalizado value={texto}/>

    const tickets = data?.data ?? [];

    if (tickets.length === 0) {
        return <p className="empty-text">Você não possui tickets ativos.</p>;
    }

    
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "aberto": return "badge-open";
            case "em_atendimento": return "badge-progress";
            case "pendente": return "badge-pending";
            default: return "badge-default";
        }
    };

    return (
        <div className="tickets-container">
            
            <div className="tickets-header">
                <div>Título do Atendimento</div>
                <div>ID</div>
                <div>Status</div>
                <div className="text-right">Ações</div>
            </div>

            <div className="tickets-list">
                {tickets.map((ticket) => {
                    const isExpanded = !!expandedTickets[ticket.id];

                    return (
                        <div key={ticket.id} className="ticket-row-wrapper">
                            {/* Linha Principal (Estilo Tabela) */}
                            <div className={`ticket-row ${isExpanded ? "active-row" : ""}`}>
                                <div className="ticket-title" title={ticket.titulo}>
                                    {ticket.titulo}
                                </div>
                                
                                <div className="ticket-id">
                                    #{ticket.id}
                                </div>
                                
                                <div className="ticket-status">
                                    <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </div>

                                <div className="ticket-actions">
                                    {/* Botão Mais Detalhes (Alterna o Ícone do Olho) */}
                                    <button 
                                        className="action-btn" 
                                        onClick={() => toggleDetails(ticket.id)}
                                        title={isExpanded ? "Ocultar detalhes" : "Mais detalhes"}
                                    >
                                        {isExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    
                                    {/* Botão Ir para o Ticket */}
                                    <button 
                                        className="action-btn primary-action" 
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        title="Ir para o atendimento"
                                    >
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Seção Desdobrável de Detalhes */}
                            {isExpanded && (
                                <div className="ticket-details-drawer">
                                    <div className="details-grid">
                                        <p><strong>Criado por:</strong> {ticket.cliente?.nome}</p>
                                        <p><strong>Assumido por:</strong> {ticket.atendente?.nome ?? "Ninguém"}</p>
                                        <p><strong>Criado em:</strong> {new Date(ticket.createdAt).toLocaleDateString("pt-BR")}</p>
                                        {!["aberto", "em_atendimento"].includes(ticket.status) && ticket.data_finalizacao && (
                                            <p><strong>Finalizado em:</strong> {new Date(ticket.data_finalizacao).toLocaleDateString("pt-BR")}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}