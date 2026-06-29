
import { api } from "./api";

export async function getMyTicketByIdRequest(id) {
    const response = await api.get(`/tickets/my/${id}`);
    return response.data;
}