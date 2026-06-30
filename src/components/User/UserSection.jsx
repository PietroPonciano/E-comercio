import { useState } from "react";
import { Search, LoaderCircle } from "lucide-react";
import { useUser } from "../../hooks/Users/useUser";
import ErroPersonalizado from "../ErroPersonalizado";
import UserCard from "./UserCard";
import UserModal from "./UserModal";
import "./User.styles.css";

export default function UserSection() {
    const [searchInput, setSearchInput] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: user, isLoading, isError, isFetching } = useUser(selectedUserId);

    function handleSearch(e) {
        e.preventDefault();
        const id = searchInput.trim();

        if (!id) return;

        setSelectedUserId(id);
    }

    return (
        <section className="user-section">
            <form className="user-search" onSubmit={handleSearch}>
                <div className="user-search-field">
                    <label htmlFor="user-id">ID do usuário</label>
                    <input
                        id="user-id"
                        type="text"
                        value={searchInput}
                        placeholder="Digite o ID do usuário"
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                <button type="submit" className="user-search-btn" disabled={!searchInput.trim()}>
                    <Search size={18} />
                    Buscar
                </button>
            </form>

            {!selectedUserId && (
                <p className="user-search-hint">Informe o ID do usuário para visualizar os dados.</p>
            )}

            {selectedUserId && isLoading && (
                <div className="section-loading">
                    <LoaderCircle className="section-spinner" size={32} />
                </div>
            )}

            {selectedUserId && isError && !isLoading && (
                <ErroPersonalizado value="o usuário" />
            )}

            {selectedUserId && user && !isLoading && (
                <>
                    <UserCard user={user} onEdit={() => setIsModalOpen(true)} isFetching={isFetching} />

                    <UserModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        user={user}
                    />
                </>
            )}
        </section>
    );
}
