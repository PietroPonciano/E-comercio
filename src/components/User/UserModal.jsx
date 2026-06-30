import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { updateUserSchema } from "../../schemas/user.schema";
import { useUpdateUser } from "../../hooks/Users/useUpdateUser";
import "./User.styles.css";

const emptyForm = {
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    cpf: "",
};

export default function UserModal({ isOpen, onClose, user }) {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState(null);

    const { mutate, isPending } = useUpdateUser();

    useEffect(() => {
        if (!user) return;

        setForm({
            nome: user.nome ?? "",
            sobrenome: user.sobrenome ?? "",
            email: user.email ?? "",
            telefone: user.telefone ?? "",
            cpf: user.cpf ?? "",
        });
    }, [user, isOpen]);

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const result = updateUserSchema.safeParse(form);

        if (!result.success) {
            setError(result.error.issues[0]?.message || "Erro de validação");
            return;
        }

        mutate(
            { id: user.id, ...result.data },
            {
                onSuccess: () => onClose(),
                onError: (err) => {
                    setError(err?.response?.data?.message || "Erro ao atualizar usuário");
                },
            }
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar usuário">
            <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-field">
                    <label htmlFor="user-nome">Nome</label>
                    <input
                        id="user-nome"
                        value={form.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="user-sobrenome">Sobrenome</label>
                    <input
                        id="user-sobrenome"
                        value={form.sobrenome}
                        onChange={(e) => handleChange("sobrenome", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="user-email">Email</label>
                    <input
                        id="user-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="user-telefone">Telefone</label>
                    <input
                        id="user-telefone"
                        value={form.telefone}
                        onChange={(e) => handleChange("telefone", e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="user-cpf">CPF</label>
                    <input
                        id="user-cpf"
                        value={form.cpf}
                        onChange={(e) => handleChange("cpf", e.target.value)}
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
