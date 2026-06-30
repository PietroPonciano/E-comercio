import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ticket.styles.css";
import { useTicket } from "../../hooks/useTicket";
import { useProfile } from "../../hooks/useProfile";
import { createMessageSchema } from "../../schemas/ticketSchema";
import { useAddMessage } from "../../hooks/useAddMessage";

// Importação dos ícones do Lucide
import { Info, Send, Image, X, Calendar, User, CheckCircle, Shield } from "lucide-react";
import MyTicketSkeleton from "./MyTicketSkeleton";
import ErroPersonalizado from "../ErroPersonalizado";


export default function TicketPage() {
    const [mensagem, setMensagem] = useState("");
    const [imagemUrl, setImagemUrl] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);

    const { id } = useParams();
    const messagesEndRef = useRef(null);

    const addMessageMutation = useAddMessage(id);
    const { data, isLoading, error } = useTicket(id);
    const { data: profileData } = useProfile();

    // Rola o chat para o final automaticamente ao receber novas mensagens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.data?.mensagens]);

    const texto = "o seu atendimento";

    if (isLoading) return <MyTicketSkeleton />;
    if (error) return <ErroPersonalizado value={texto}/>

    const ticket = data?.data;
    const usuarioLogado = profileData?.data;

    async function handleSendMessage(e) {
        e.preventDefault(); // Evita o reload da página

        const payload = {};
        if (mensagem.trim() !== "") payload.mensagem = mensagem.trim();
        if (imagemUrl.trim() !== "") payload.imagem_url = imagemUrl.trim();

        if (Object.keys(payload).length === 0) {
            alert("Digite uma mensagem ou insira a URL de uma imagem.");
            return;
        }

        const result = createMessageSchema.safeParse(payload);
        if (!result.success) {
            alert(result.error.issues[0].message);
            return;
        }

        try {
            await addMessageMutation.mutateAsync(result.data);
            setMensagem("");
            setImagemUrl("");
            setShowImageInput(false);
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar mensagem.");
        }
    }

    return (
        <div className="chat-wrapper">
            {/* 1. HEADER DO CHAT UNIFICADO */}
            <header className="chat-header">
                <div className="chat-header-info">
                    <h2>{ticket.titulo}</h2>
                    <span className="chat-header-status">#{ticket.id} • {ticket.status}</span>
                </div>
                <button
                    className="info-trigger-btn"
                    onClick={() => setIsModalOpen(true)}
                    title="Detalhes do Ticket"
                >
                    <Info size={22} />
                </button>
            </header>

            {/* 2. CONTEÚDO DAS MENSAGENS */}
            <div className="chat-messages-area">
                {ticket.mensagens?.map((msg) => {
                    const ehMinhaMensagem = usuarioLogado?.id === msg.autor.id;

                    return (
                        <div
                            key={msg.id}
                            className={`message-row ${ehMinhaMensagem ? "row-me" : "row-other"}`}
                        >
                            {/* Avatar Simulado igual ao da imagem */}
                            <div className="message-avatar">
                                {msg.autor.nome.charAt(0).toUpperCase()}
                            </div>

                            <div className="message-bubble-wrapper">
                                <span className="message-author-name">{msg.autor.nome}</span>
                                <div className="message-bubble">
                                    {msg.mensagem && <p>{msg.mensagem}</p>}
                                    {msg.imagem_url && (
                                        <img src={msg.imagem_url} alt="Anexo" className="message-image" />
                                    )}
                                </div>
                                <span className="message-timestamp">
                                    {new Date(msg.createdAt).toLocaleDateString("pt-BR")} às{" "}
                                    {new Date(msg.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* 3. FORMULÁRIO DE ENVIO UNIFICADO (BOTTOM BAR) */}
            <footer className="chat-footer">
                <form onSubmit={handleSendMessage} className="chat-input-form">
                    {showImageInput && (
                        <div className="image-url-popover">
                            <input
                                type="text"
                                value={imagemUrl}
                                onChange={(e) => setImagemUrl(e.target.value)}
                                placeholder="Cole a URL da imagem aqui..."
                            />
                        </div>
                    )}

                    <div className="input-actions-group">
                        <button
                            type="button"
                            className={`attachment-btn ${showImageInput ? "active" : ""}`}
                            onClick={() => setShowImageInput(!showImageInput)}
                            title="Adicionar imagem URL"
                        >
                            <Image size={20} />
                        </button>

                        <input
                            type="text"
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            placeholder="Digite uma mensagem..."
                            className="main-chat-input"
                        />

                        <button
                            type="submit"
                            className="chat-send-btn"
                            disabled={addMessageMutation.isPending || (!mensagem.trim() && !imagemUrl.trim())}
                        >
                            {addMessageMutation.isPending ? "..." : <Send size={18} />}
                        </button>
                    </div>
                </form>
            </footer>

            {/* 4. MODAL DE DETALHES DO TICKET */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <h3>Detalhes do Ticket</h3>
                            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </header>
                        <div className="modal-body">
                            <div className="info-item"><User size={16} /> <span><strong>Cliente:</strong> {ticket.cliente?.nome}</span></div>
                            <div className="info-item"><Shield size={16} /> <span><strong>Atendente:</strong> {ticket.atendente?.nome ?? "Ninguém"}</span></div>
                            <div className="info-item"><CheckCircle size={16} /> <span><strong>Status atual:</strong> {ticket.status}</span></div>
                            <div className="info-item"><Calendar size={16} /> <span><strong>Criado em:</strong> {new Date(ticket.createdAt).toLocaleString("pt-BR")}</span></div>
                            {!["aberto", "em_atendimento"].includes(ticket.status) && ticket.data_finalizacao && (
                                <div className="info-item text-danger">
                                    <Calendar size={16} /> <span><strong>Finalizado em:</strong> {new Date(ticket.data_finalizacao).toLocaleString("pt-BR")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}