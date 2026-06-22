import { api } from "./api"

export async function getProducts({page = 1}) {
    const { data } = await api.get("/api/products", {
        params: { page }
    })
    
    return data;
}