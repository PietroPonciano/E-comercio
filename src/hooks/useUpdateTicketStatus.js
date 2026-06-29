import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketStatusRequest } from "../services/updateTicketStatus.service";

export function useUpdateTicketStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }) =>
            updateTicketStatusRequest(id, status),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["all-tickets"]
            });
        }
    });
}