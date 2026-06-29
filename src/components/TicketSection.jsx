import TicketCard from "./TicketCard";
import "../styles/TicketSection.styles.css"

export default function TicketSection({ title, tickets }) {
    return (
        <section className="ticket-section">
            <header className="ticket-section-header">
                <h2>{title}</h2>
                <span>{tickets.length} ticket(s)</span>
            </header>

            {tickets.length === 0 ? (
                <div className="ticket-section-empty">
                    <p>Nenhum ticket encontrado.</p>
                </div>
            ) : (
                <div className="ticket-section-list">
                    {tickets.map((ticket) => (
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}