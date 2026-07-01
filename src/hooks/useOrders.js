import { useQuery } from "@tanstack/react-query";
import { getMyOrderById, getMyOrders } from "../services/orders.service";

export function useMyOrders() {
    return useQuery({
        queryKey: ["my-orders"],
        queryFn: getMyOrders,
    });
}

export function useMyOrder(id) {
    return useQuery({
        queryKey: ["my-order", id],
        queryFn: () => getMyOrderById(id),
        enabled: !!id,
    });
}
