import TicketSection from "../components/TicketSection";
import { useAllTickets } from "../hooks/useAllTickets";

export default function Tickets() {
    const {
        data: tickets = [],
        isLoading,
        isError,
        error,
    } = useAllTickets();
    console.log(tickets);
    if (isLoading) {
        return <></>;
    }

    if (isError) {
        return <p>{error.message}</p>;
    }

    const sections = tickets.reduce(
        (acc, ticket) => {
            switch (ticket.status) {
                case "aberto":
                    acc.abertos.push(ticket);
                    break;

                case "em_atendimento":
                    acc.andamento.push(ticket);
                    break;

                case "finalizado":
                    acc.finalizados.push(ticket);
                    break;

                default:
                    break;
            }

            return acc;
        },
        {
            abertos: [],
            andamento: [],
            finalizados: [],
        }
    );

    return (
        <>
            <TicketSection
                title="Abertos"
                tickets={sections.abertos}
            />

            <TicketSection
                title="Em andamento"
                tickets={sections.andamento}
            />

            <TicketSection
                title="Finalizados"
                tickets={sections.finalizados}
            />
        </>
    );
}