export function getMercadoPagoRedirectUrl(checkoutData) {
    const url = import.meta.env.DEV
        ? checkoutData.sandbox_init_point
        : checkoutData.init_point;

    if (!url) {
        throw new Error("URL de pagamento não disponível.");
    }

    return url;
}

export function redirectToMercadoPago(checkoutData) {
    window.location.href = getMercadoPagoRedirectUrl(checkoutData);
}
