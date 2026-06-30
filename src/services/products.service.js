import { api } from "./api";

export async function getProducts({ page = 1 } = {}) {
    const { data } = await api.get("/products", {
        params: { page },
    });

    return data;
}

export async function createProduct(payload) {
    const { data } = await api.post("/products", payload);
    return data;
}

export async function updateProduct({ id, ...payload }) {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
}

export async function deleteProduct(id) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
}
