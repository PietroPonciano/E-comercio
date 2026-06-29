import { api } from "./api";

export async function deleteTicketRequest(id) {
    const response = await api.delete(`/tickets/${id}`);

    return response.data;
}