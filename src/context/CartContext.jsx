import { createContext, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "ecommerce_cart";

const CartContext = createContext();

function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCartFromStorage);

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (product, quantidade = 1) => {
        setItems((current) => {
            const existing = current.find((item) => item.produto_id === product.id);

            if (existing) {
                return current.map((item) =>
                    item.produto_id === product.id
                        ? { ...item, quantidade: item.quantidade + quantidade }
                        : item
                );
            }

            return [
                ...current,
                {
                    produto_id: product.id,
                    quantidade,
                    nome: product.nome,
                    preco: product.preco,
                    imagem_url: product.imagem_url,
                },
            ];
        });
    };

    const updateQuantity = (produtoId, quantidade) => {
        if (quantidade < 1) return;

        setItems((current) =>
            current.map((item) =>
                item.produto_id === produtoId ? { ...item, quantidade } : item
            )
        );
    };

    const removeItem = (produtoId) => {
        setItems((current) => current.filter((item) => item.produto_id !== produtoId));
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);

    const subtotal = items.reduce(
        (sum, item) => sum + item.preco * item.quantidade,
        0
    );

    const toCheckoutPayload = () =>
        items.map(({ produto_id, quantidade }) => ({ produto_id, quantidade }));

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
                totalItems,
                subtotal,
                toCheckoutPayload,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart deve ser usado dentro de CartProvider");
    }

    return context;
}
