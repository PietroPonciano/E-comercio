import { api } from "./api";

export async function getMyTicketsRequest() {
    const response = await api.get("/tickets/my");

    return response.data;
}