import { api } from "./api";

export async function createTicketRequest(title) {
    const response = await api.post("/tickets/", {
        titulo: title
    });

    return response.data;
}