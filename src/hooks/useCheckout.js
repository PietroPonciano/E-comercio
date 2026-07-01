import { useMutation } from "@tanstack/react-query";
import { createCheckout } from "../services/checkout.service";
import { redirectToMercadoPago } from "../utils/checkout";

export function useCheckout() {
    return useMutation({
        mutationFn: createCheckout,
        onSuccess: (response) => {
            if (!response?.success || !response?.data) {
                throw new Error("Resposta inválida do servidor.");
            }

            redirectToMercadoPago(response.data);
        },
    });
}
