import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMessageRequest } from "../services/ticketMessages.service";

export function useAddMessage(ticketId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            addMessageRequest(ticketId, data),

        onSuccess: (response) => {
            queryClient.setQueryData(
                ["ticket", ticketId],
                (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        data: {
                            ...oldData.data,
                            mensagens: [
                                ...oldData.data.mensagens,
                                response.data
                            ],
                            quantidade_mensagens:
                                oldData.data
                                    .quantidade_mensagens + 1
                        }
                    };
                }
            );
        }
    });
}