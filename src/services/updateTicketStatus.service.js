import { api } from "./api";

export async function updateTicketStatusRequest(id, status) {
    const response = await api.put(`/tickets/${id}/status`, {
        status
    });

    return response.data;
}