import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import {
    createProductSchema,
    updateProductSchema,
} from "../../schemas/product.schema";
import { useCreateProduct } from "../../hooks/Products/useCreateProduct";
import { useUpdateProduct } from "../../hooks/Products/useUpdateProduct";
import { useCategories } from "../../hooks/Categories/useCategories";
import "../../components/Modal/Modal.styles.css";
import "./Product.styles.css";

const emptyForm = {
    nome: "",
    descricao: "",
    preco: "",
    imagem_url: "",
    categoria_id: "",
};

export default function ProductModal({ isOpen, onClose, mode, product }) {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState(null);

    const { data: categories = [] } = useCategories();
    const { mutate: create, isPending: isCreating } = useCreateProduct();
    const { mutate: update, isPending: isUpdating } = useUpdateProduct();

    const isPending = isCreating || isUpdating;
    const isEdit = mode === "edit";

    useEffect(() => {
        if (mode === "create") {
            setForm(emptyForm);
            return;
        }

        if (!product) return;

        setForm({
            nome: product.nome ?? "",
            descricao: product.descricao ?? "",
            preco: product.preco ?? "",
            imagem_url: product.imagem_url ?? "",
            categoria_id: product.categoria_id ?? "",
        });
    }, [mode, product, isOpen]);

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const schema = isEdit ? updateProductSchema : createProductSchema;
        const result = schema.safeParse(form);

        if (!result.success) {
            setError(result.error.issues[0]?.message || "Erro de validação");
            return;
        }

        const payload = {
            ...result.data,
            categoria_id: result.data.categoria_id || null,
            imagem_url: result.data.imagem_url || null,
        };

        if (isEdit) {
            update(
                { id: product.id, ...payload },
                {
                    onSuccess: () => onClose(),
                    onError: (err) => {
                        setError(err?.response?.data?.message || "Erro ao atualizar produto");
                    },
                }
            );
            return;
        }

        create(payload, {
            onSuccess: () => onClose(),
            onError: (err) => {
                setError(err?.response?.data?.message || "Erro ao criar produto");
            },
        });
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Editar produto" : "Novo produto"}
        >
            <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-field">
                    <label htmlFor="product-nome">Nome</label>
                    <input
                        id="product-nome"
                        value={form.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="product-descricao">Descrição</label>
                    <textarea
                        id="product-descricao"
                        value={form.descricao}
                        onChange={(e) => handleChange("descricao", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="product-preco">Preço</label>
                    <input
                        id="product-preco"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.preco}
                        onChange={(e) => handleChange("preco", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="product-imagem">URL da imagem</label>
                    <input
                        id="product-imagem"
                        value={form.imagem_url}
                        onChange={(e) => handleChange("imagem_url", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="product-categoria">Categoria</label>
                    <select
                        id="product-categoria"
                        value={form.categoria_id}
                        onChange={(e) => handleChange("categoria_id", e.target.value)}
                    >
                        <option value="">Sem categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="modal-error">{error}</p>}

                <div className="modal-actions">
                    <button type="button" className="modal-btn modal-btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="modal-btn modal-btn-primary" disabled={isPending}>
                        {isPending ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
