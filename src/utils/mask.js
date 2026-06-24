export function cpfMask(value) {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14);
}

export function phoneMask(value) {
    return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "+$1 $2")
        .replace(/^(\+\d{2}\s\d)(\d{4})(\d)/, "$1 $2-$3")
        .slice(0, 16);
}

export function onlyNumbers(value) {
    return value.replace(/\D/g, "");
}