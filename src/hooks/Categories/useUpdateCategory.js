import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../../services/categories.service";

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });
}
