import { api } from "./api";

export async function assumeTicketRequest(id) {
    const response = await api.post(`/tickets/${id}`);

    return response.data;
}