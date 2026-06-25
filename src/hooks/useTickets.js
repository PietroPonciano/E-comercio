import { useQuery } from "@tanstack/react-query";
import { getMyTicketsRequest } from "../services/listTicket.service";

export function useMyTickets() {
    return useQuery({
        queryKey: ["my-tickets"],
        queryFn: getMyTicketsRequest,
    });
}