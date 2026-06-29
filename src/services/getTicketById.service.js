import { api } from "./api";

export async function getTicketByIdRequest(id) {
    const response = await api.get(`/tickets/${id}`);

    return response.data;
}