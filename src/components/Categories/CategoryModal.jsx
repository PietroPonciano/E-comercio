import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import {
    createCategorySchema,
    updateCategorySchema,
} from "../../schemas/category.schema";
import { useCreateCategory } from "../../hooks/Categories/useCreateCategory";
import { useUpdateCategory } from "../../hooks/Categories/useUpdateCategory";
import "../../components/Modal/Modal.styles.css";
import "./Category.styles.css";

const emptyForm = {
    nome: "",
    descricao: "",
};

export default function CategoryModal({ isOpen, onClose, mode, category }) {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState(null);

    const { mutate: create, isPending: isCreating } = useCreateCategory();
    const { mutate: update, isPending: isUpdating } = useUpdateCategory();

    const isPending = isCreating || isUpdating;
    const isEdit = mode === "edit";

    useEffect(() => {
        if (mode === "create") {
            setForm(emptyForm);
            return;
        }

        if (!category) return;

        setForm({
            nome: category.nome ?? "",
            descricao: category.descricao ?? "",
        });
    }, [mode, category, isOpen]);

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const schema = isEdit ? updateCategorySchema : createCategorySchema;
        const result = schema.safeParse(form);

        if (!result.success) {
            setError(result.error.issues[0]?.message || "Erro de validação");
            return;
        }

        if (isEdit) {
            update(
                { id: category.id, ...result.data },
                {
                    onSuccess: () => onClose(),
                    onError: (err) => {
                        setError(err?.response?.data?.message || "Erro ao atualizar categoria");
                    },
                }
            );
            return;
        }

        create(result.data, {
            onSuccess: () => onClose(),
            onError: (err) => {
                setError(err?.response?.data?.message || "Erro ao criar categoria");
            },
        });
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Editar categoria" : "Nova categoria"}
        >
            <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-field">
                    <label htmlFor="category-nome">Nome</label>
                    <input
                        id="category-nome"
                        value={form.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="category-descricao">Descrição</label>
                    <textarea
                        id="category-descricao"
                        value={form.descricao}
                        onChange={(e) => handleChange("descricao", e.target.value)}
                    />
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
