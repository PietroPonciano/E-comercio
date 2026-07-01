import { api } from "./api";

export async function getMyOrders() {
    const { data } = await api.get("/orders/my");
    return data;
}

export async function getMyOrderById(id) {
    const { data } = await api.get(`/orders/my/${id}`);
    return data;
}
