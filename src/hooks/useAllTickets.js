import { useQuery } from "@tanstack/react-query";
import { getAllTicketsRequest } from "../services/getAllTickets.service";

export function useAllTickets() {
    return useQuery({
        queryKey: ["all-tickets"],
        queryFn: getAllTicketsRequest
    });
}