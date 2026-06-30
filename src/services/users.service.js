import { api } from "./api";

export async function getUser(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
}

export async function updateUser({ id, ...payload }) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
}
