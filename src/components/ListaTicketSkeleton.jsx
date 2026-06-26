import "../styles/ListaTicketSkeleton.styles.css";

export default function ListaTicketSkeleton() {
    // Renderiza 5 linhas de esqueleto para preencher a tela
    const skeletonRows = Array(5).fill(0);

    return (
        <div className="tickets-container-sk">
            {/* Cabeçalho estático para evitar quebra de layout quando carregar */}
            <div className="tickets-header-sk">
                <div>Título do Ticket</div>
                <div>ID</div>
                <div>Status</div>
                <div className="text-right-sk">Ações</div>
            </div>

            <div className="tickets-list-sk">
                {skeletonRows.map((_, index) => (
                    <div key={index} className="ticket-row-sk">
                        {/* Placeholder do Título */}
                        <div className="sk-item sk-title"></div>
                        
                        {/* Placeholder do ID */}
                        <div className="sk-item sk-id"></div>
                        
                        {/* Placeholder do Status Badge */}
                        <div className="sk-item sk-badge"></div>
                        
                        {/* Placeholders dos Botões de Ação */}
                        <div className="ticket-actions-sk">
                            <div className="sk-item sk-btn"></div>
                            <div className="sk-item sk-btn"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}