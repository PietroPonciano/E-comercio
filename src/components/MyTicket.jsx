import { useState } from "react";
import { useParams } from "react-router-dom";

import { useTicket } from "../hooks/useTicket";
import { useProfile } from "../hooks/useProfile";

import { createMessageSchema } from "../schemas/ticketSchema";
import { useAddMessage } from "../hooks/useAddMessage";

export default function TicketPage() {
    const [mensagem, setMensagem] =
        useState("");

    const [imagemUrl, setImagemUrl] =
        useState("");

    const { id } = useParams();

    const addMessageMutation =
        useAddMessage(id);

    const {
        data,
        isLoading,
        error
    } = useTicket(id);

    const {
        data: profileData
    } = useProfile();

    if (isLoading) {
        return <p>Carregando ticket...</p>;
    }

    if (error) {
        return <p>Erro ao carregar ticket.</p>;
    }

    const ticket = data?.data;

    const usuarioLogado =
        profileData?.data;

    async function handleSendMessage() {
        // 1. Cria um objeto vazio para o payload
        const payload = {};

        // 2. Só adiciona se o usuário digitou algo (removendo espaços em branco)
        if (mensagem.trim() !== "") {
            payload.mensagem = mensagem.trim();
        }

        if (imagemUrl.trim() !== "") {
            payload.imagem_url = imagemUrl.trim();
        }

        // 3. Validação extra: evita enviar o formulário se ambos estiverem vazios
        if (Object.keys(payload).length === 0) {
            alert("Digite uma mensagem ou insira a URL de uma imagem.");
            return;
        }

        // 4. Passa o payload filtrado para o Zod
        const result = createMessageSchema.safeParse(payload);

        if (!result.success) {
            alert(result.error.issues[0].message);
            return;
        }

        try {
            // Envia apenas as propriedades que têm valor
            await addMessageMutation.mutateAsync(result.data);

            // Limpa os campos após o sucesso
            setMensagem("");
            setImagemUrl("");
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar mensagem.");
        }
    }

    return (
        <div className="ticket-page">

            <div className="ticket-header">
                <h2>{ticket.titulo}</h2>

                <p>
                    ID: {ticket.id}
                </p>

                <p>
                    Status: {ticket.status}
                </p>

                <p>
                    Cliente:{" "}
                    {ticket.cliente?.nome}
                </p>

                <p>
                    Atendente:{" "}
                    {ticket.atendente?.nome ??
                        "Ninguém"}
                </p>

                <p>
                    Criado em{" "}
                    {new Date(
                        ticket.createdAt
                    ).toLocaleDateString(
                        "pt-BR"
                    )}
                </p>

                {![
                    "aberto",
                    "em_atendimento"
                ].includes(ticket.status) &&
                    ticket.data_finalizacao && (
                        <p>
                            Finalizado em{" "}
                            {new Date(
                                ticket.data_finalizacao
                            ).toLocaleDateString(
                                "pt-BR"
                            )}
                        </p>
                    )}
            </div>

            <div className="messages-container">
                <h3>
                    Mensagens ({ticket.quantidade_mensagens})
                </h3>

                {ticket.mensagens?.map((msg) => {
                    const ehMinhaMensagem =
                        usuarioLogado?.id === msg.autor.id;

                    return (
                        <div
                            key={msg.id}
                            className={`message-card ${ehMinhaMensagem
                                ? "my-message"
                                : "other-message"
                                }`}
                        >
                            <strong>
                                {msg.autor.nome}
                            </strong>

                            {msg.mensagem && (
                                <p>{msg.mensagem}</p>
                            )}

                            {msg.imagem_url && (
                                <img
                                    src={msg.imagem_url}
                                    alt="Anexo"
                                />
                            )}

                            <small>
                                {new Date(
                                    msg.createdAt
                                ).toLocaleString("pt-BR")}
                            </small>
                        </div>
                    );
                })}
            </div>

            <div className="message-form">
                <h3>
                    Nova mensagem
                </h3>

                <textarea
                    value={mensagem}
                    onChange={(e) =>
                        setMensagem(
                            e.target.value
                        )
                    }
                    placeholder="Digite sua mensagem"
                />

                <input
                    type="text"
                    value={imagemUrl}
                    onChange={(e) =>
                        setImagemUrl(
                            e.target.value
                        )
                    }
                    placeholder="URL da imagem"
                />

                <button
                    onClick={handleSendMessage}
                    disabled={
                        addMessageMutation.isPending
                    }
                >
                    {addMessageMutation.isPending
                        ? "Enviando..."
                        : "Enviar mensagem"}
                </button>
            </div>



        </div>
    );
}