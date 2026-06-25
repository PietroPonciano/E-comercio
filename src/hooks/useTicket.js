
import { useQuery } from "@tanstack/react-query";
import { getTicketByIdRequest } from "../services/getMyTicketById.service";

export function useTicket(id) {
    return useQuery({
        queryKey: ["ticket", id],
        queryFn: () => getTicketByIdRequest(id),
        enabled: !!id, // evita rodar sem id
    });
}