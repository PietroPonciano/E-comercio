import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicketRequest } from "../services/deleteTicket.service";

export function useDeleteTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTicketRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["all-tickets"]
            });
        }
    });
}