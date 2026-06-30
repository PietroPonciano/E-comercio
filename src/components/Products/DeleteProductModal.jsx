import Modal from "../Modal/Modal";
import { useDeleteProduct } from "../../hooks/Products/useDeleteProduct";
import "../../components/Modal/Modal.styles.css";

export default function DeleteProductModal({ isOpen, onClose, product }) {
    const { mutate, isPending } = useDeleteProduct();

    function handleDelete() {
        if (!product) return;

        mutate(product.id, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Excluir produto">
            <p className="delete-modal-text">
                Tem certeza que deseja excluir <strong>{product?.nome}</strong>?
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
