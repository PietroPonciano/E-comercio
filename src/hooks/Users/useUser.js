import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/users.service";

export function useUser(id) {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => getUser(id),
        enabled: Boolean(id),
        select: (response) => response?.data,
    });
}
