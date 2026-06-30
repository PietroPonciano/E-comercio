import Modal from "../Modal/Modal";
import { useDeleteCategory } from "../../hooks/Categories/useDeleteCategory";
import "../../components/Modal/Modal.styles.css";

export default function DeleteCategoryModal({ isOpen, onClose, category }) {
    const { mutate, isPending } = useDeleteCategory();

    function handleDelete() {
        if (!category) return;

        mutate(category.id, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Excluir categoria">
            <p className="delete-modal-text">
                Tem certeza que deseja excluir <strong>{category?.nome}</strong>?
            </p>

            <div className="modal-actions">
                <button type="button" className="modal-btn modal-btn-cancel" onClick={onClose}>
                    Cancelar
                </button>
                <button
                    type="button"
                    className="modal-btn modal-btn-danger"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    {isPending ? "Excluindo..." : "Excluir"}
                </button>
            </div>
        </Modal>
    );
}
