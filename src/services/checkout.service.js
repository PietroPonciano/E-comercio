import { api } from "./api";

export async function createCheckout(payload) {
    const { data } = await api.post("/orders/checkout", payload);
    return data;
}

export async function getFormasEntrega() {
    const { data } = await api.get("/shipping-methods/");
    return data;
}
