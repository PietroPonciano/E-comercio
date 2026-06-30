import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../services/users.service";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["user", variables.id],
            });
        },
    });
}
