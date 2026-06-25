import { api } from "./api";

export async function addMessageRequest(
    ticketId,
    data
) {
    const response = await api.post(
        `/tickets/${ticketId}/messages`,
        data
    );

    return response.data;
}