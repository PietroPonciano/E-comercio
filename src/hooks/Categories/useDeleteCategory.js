import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../../services/categories.service";

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });
}
