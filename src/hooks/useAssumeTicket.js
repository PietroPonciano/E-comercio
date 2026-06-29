import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assumeTicketRequest } from "../services/assumeTicket.service";

export function useAssumeTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: assumeTicketRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["all-tickets"]
            });
        }
    });
}