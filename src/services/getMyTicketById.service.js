
import { api } from "./api";

export async function getTicketByIdRequest(id) {
    const response = await api.get(`/tickets/my/${id}`);
    return response.data;
}