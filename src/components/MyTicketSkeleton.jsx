import "../styles/MyTicketSkeleton.styles.css";

export default function MyTicketSkeleton() {
    // Cria um array para simular mensagens alternadas no chat
    const dummyMessages = [
        { isMe: false, width: "60%" },
        { isMe: true, width: "45%" },
        { isMe: false, width: "70%" },
        { isMe: true, width: "30%" }
    ];

    return (
        <div className="chat-wrapper-sk">
            {/* Header Superior em Linha */}
            <header className="chat-header-sk">
                <div className="chat-header-info-sk">
                    <div className="sk-chat-item sk-chat-header-title"></div>
                    <div className="sk-chat-item sk-chat-header-subtitle"></div>
                </div>
                <div className="sk-chat-item sk-chat-info-icon"></div>
            </header>

            {/* Balões de Conversa Correndo na Tela */}
            <div className="chat-messages-area-sk">
                {dummyMessages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message-row-sk ${msg.isMe ? "row-me-sk" : "row-other-sk"}`}
                    >
                        {/* Avatar Redondo */}
                        <div className="sk-chat-item sk-chat-avatar"></div>

                        <div className="message-bubble-wrapper-sk">
                            {/* Nome do Autor */}
                            <div className="sk-chat-item sk-chat-author"></div>
                            {/* Balão da Mensagem com largura variável */}
                            <div 
                                className="sk-chat-item sk-chat-bubble" 
                                style={{ width: msg.width }}
                            ></div>
                            {/* Timestamp */}
                            <div className="sk-chat-item sk-chat-time"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Bar Inferior Unificada */}
            <footer className="chat-footer-sk">
                <div className="input-actions-group-sk">
                    <div className="sk-chat-item sk-chat-input-btn"></div>
                    <div className="sk-chat-item sk-chat-input-field"></div>
                    <div className="sk-chat-item sk-chat-input-btn"></div>
                </div>
            </footer>
        </div>
    );
}