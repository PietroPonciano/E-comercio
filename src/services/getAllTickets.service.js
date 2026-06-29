import { api } from "./api";

export async function getAllTicketsRequest() {
    const response = await api.get("/tickets/all");

    return response.data.data;
}