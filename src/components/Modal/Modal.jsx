import { X } from "lucide-react";
import "./Modal.styles.css";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal-header">
                    <h2 id="modal-title">{title}</h2>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
